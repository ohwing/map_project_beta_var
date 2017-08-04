var mapContainer = $('#map')[0];
var mapOptions = {
	center: new daum.maps.LatLng(37.57484288719911, 126.93107087733638),
	level: 12
};

var map = new daum.maps.Map(mapContainer, mapOptions);

(function(daum, jQuery){
    
    var $ = jQuery;
    var btn = $('#btn')[0];
    // var newPlace = false;
    var content = '<div id="img"></div>';
    // var buttonCheck = false;
    
    
    // 	var marker = new daum.maps.Marker();
 	var curOverlay = new daum.maps.CustomOverlay({
 	    map: map
 	});
 	
 	var geocoder = new daum.maps.services.Geocoder();

    // marker.setMap(map);
	function callModal(){
        $('#myModal').modal('show');
    }
    
    function handleMove(e){
        var latlng = e.latLng;
        
        map.setCursor("default");
        curOverlay.setContent(content);
        curOverlay.setPosition(latlng);
    }
    
    function callAddress(result, status) {
        if (status === daum.maps.services.Status.OK) {
            $('#form__address')[0].value = result[0].address.address_name;
            if(result[0].road_address == null){
                console.log($('#form__road__address')[0]);
                $('#form__road__address')[0].value = '도로명 주소가 없습니다.';
            }else{
                console.log($('#form__road__address')[0]);
                $('#form__road__address')[0].value = result[0].road_address.address_name;
            }
        }
    }

    function handleClick(e) {
        var latlng = e.latLng;
        var message = null;
        
        callModal();
        message = '위도 ' + latlng.getLat() + ' 경도 ' + latlng.getLng();
        $('#result')[0].innerHTML = message;
        
        daum.maps.event.removeListener(map, 'click', handleClick);
        daum.maps.event.removeListener(map, 'mousemove', handleMove);
        geocoder.coord2Address(latlng.getLng(), latlng.getLat(), callAddress);
        
        $('#xy__table')[0].value = message;
        map.setCursor(null);
        curOverlay.setVisible(false);
    }
    
    function cancelClick(e){
        daum.maps.event.removeListener(map, 'click', handleClick);
        daum.maps.event.removeListener(map, 'mousemove', handleMove);
        daum.maps.event.removeListener(map, 'rightclick', cancelClick);
        map.setCursor(null);
        curOverlay.setVisible(false);
    }
    
    btn.addEventListener('click', function(e){
        // buttonCheck = !buttonCheck;
        // console.log('마커생성하기 상태: ', buttonCheck);
        // if(buttonChecdk){
            curOverlay.setVisible(true);
            daum.maps.event.addListener(map, 'click', handleClick);
            daum.maps.event.addListener(map, 'rightclick', cancelClick);
            daum.maps.event.addListener(map, 'mousemove', handleMove);
        // }
    }, false);

})(window.daum, window.jQuery);

(function(daum, jQuery){
    
    var $ = jQuery;
    var btn2 = $('#btn2')[0], btn3 = $('#btn3')[0];
    // var content = null;
    var markerArray = [];
    
    var moveMarker = new daum.maps.Marker();
    var geocoder = new daum.maps.services.Geocoder();
    var selectMarker = null;
    
    
    // btn2 function start
    function callModal(){
        $('#multiAddModel').modal('show');
    }
    
    function handleClick(e){
        var latlng = e.latLng;
        moveMarker.setMap(map);
        moveMarker.setPosition(latlng);
    }
    
    function markerClick(e){
        
         selectMarker = new daum.maps.Marker({
             position: e.latLng
         });
         
         selectMarker.setMap(map);
         markerArray.push(selectMarker);
         
         
        for(var i = 0; i < markerArray.length; i++){
            markerArray[i].setMap(map);
        }
    }
    // btn2 function end

    function cancelClick(e) {
        daum.maps.event.removeListener(map, 'click', markerClick);
        daum.maps.event.removeListener(map, 'mousemove', handleClick);
        daum.maps.event.removeListener(map, 'rightclick', cancelClick);
        moveMarker.setMap(null);
        for(var i = 0; i < markerArray.length; i++){
            markerArray[i].setMap(null);
            console.log(markerArray);
        }
        markerArray = 0;
        markerArray = [];
    }
    
    // btn3 multi function start
    function markerAddress(result, status){
        var contentAddress = null, contentRoad = null;
        var addressValue = null, roadValue = null;
        var createForm = document.createElement("form");
        
        createForm.setAttribute("id", "form2");
        console.log(createForm);
        document.getElementById("multiModel-body").appendChild(createForm);
        
        addressValue = result[0].address.address_name;
        roadValue = result[0].road_address;
        
        contentAddress = $('<label for="form__address">지번 주소</label><input type="text" class="form-control" id="form__address" placeholder="지번 주소">').appendTo('#form2');
        $(contentAddress)[1].value = addressValue;
        
        if(roadValue == null){
           contentRoad = $('<label for="form__road__address">도로명 주소</label><input type="text" class="form-control" id="form__road__address" placeholder="도로명 주소">').appendTo('#form2');
           console.log(roadValue);
           $(contentRoad)[1].value = "도로명 주소가 없습니다.";
           
        }else{
           contentRoad = $('<label for="form__road__address">도로명 주소</label><input type="text" class="form-control" id="form__road__address" placeholder="도로명 주소">').appendTo('#form2');
           console.log(roadValue);
           $(contentRoad)[1].value = roadValue.address_name;
        }
    }
    
    function markerSumbmit(markerArray){
        
        for(var i = 0; i < markerArray.length; i++){
            geocoder.coord2Address(markerArray[i].getPosition().getLng(), markerArray[i].getPosition().getLat(), markerAddress);
        }
        
        callModal();
        cancelClick();
        $('#form2').remove();
    }
    // btn3 multi function end
    
    btn2.addEventListener('click', function(e){
        daum.maps.event.addListener(map, 'click', markerClick);
        daum.maps.event.addListener(map, 'rightclick', cancelClick);
        daum.maps.event.addListener(map, 'mousemove', handleClick);
    }, false);
    
    btn3.addEventListener('click', function(e){
        if(markerArray == 0){
            alert("markerArray에 내용이 없습니다.");
        }else{
            markerSumbmit(markerArray);
        }
    }, false);
    
})(window.daum, window.jQuery);