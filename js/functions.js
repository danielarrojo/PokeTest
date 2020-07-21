
//var api_url = 'http://pokeapi.salestock.net/api/v2/pokemon';
//var api_species = 'http://pokeapi.salestock.net/api/v2/pokemon-species/';
var api_url = 'https://pokeapi.co/api/v2/pokemon';
var api_species = 'https://pokeapi.co/api/v2/pokemon-species/';
var pokeJson = '';



function initElements(){
	$('#searchField').attr('placeholder', STRINGS.search);
	$('#searchField').on('input',function(e){
 		if ($('#searchField').val().length >= 1) {
 			searchItem($('#searchField').val());
 		} else if ($('#searchField').val().length <= 0){
 			showAllItems();
 		}
	});
	$('#loader').hide();
	urlRequest('initial');	
	$('#searchField').prop('disabled', true);
	$('#close').on('click', function(){
        $('#popup').fadeOut('slow');
        $('.popup-overlay').fadeOut('slow');
    });
}


function urlRequest(request, params){
	$.ajax({
        url: api_url + '/?limit=10',
        contentType: "application/json",
        dataType: 'json',
        beforeSend: function() {
       		 $('#loader').show();
       		 $('#searchField').prop('disabled', true);
    	},
        success: function(result){
        	$('#loader').hide();
        	$('#searchField').prop('disabled', false);
            pokeJson = result;
            //getPokemonFake();
			getPokemon(0);
        }   
  	});
}

function getPokemonFake(){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
 	if (this.readyState == 4 && this.status == 200) {
    	console.log(JSON.parse(this.responseText));
    	var item = $('<section></section>').addClass('container-item-prev').attr('id','item1');

        $('#container').append(item);
   		pokeJson.results[0].pokeData = JSON.parse(this.responseText);
        //getEvolution(1);
        cloneItem(0, JSON.parse(this.responseText));
  	 }
	};
	xmlhttp.open("GET", "js/pokefake.json", true);
	xmlhttp.send();
}

function getPokemon(value){

	if (value < pokeJson.results.length) {
		$.ajax({
        		url: pokeJson.results[value].url,
        		contentType: "application/json",
       			dataType: 'json',
        	beforeSend: function() {
        		 var item = $('<section></section>').addClass('container-item-prev').attr('id','item'+(value+1));
        		 var loaderItem = $('<div></div>').addClass('loaderItem').attr('id','loaderItem');
    			 item.append(loaderItem);
        		 $('#container').append(item);

    		},
        	success: function(result){
        		 pokeJson.results[value].pokeData = result;
        		 //cloneItem(value, result);
        		 value++;
           		 getEvolution(value);           	 
            	 
        	}
    	})
	}
}

function getEvolution(value){
	$.ajax({
        url: api_species + value,
        contentType: "application/json",
       	dataType: 'json',
        beforeSend: function() {
    	},
        success: function(result){
        	pokeJson.results[value-1].evolution = result;
        	cloneItem(value-1, result);
            getPokemon(value);
        }
    })
}

function searchItem(params){
	console.log('inside');
	var i=1;
	$.each(pokeJson.results, function(key,value) {
		$('#item'+i).show();
		if (!value.name.toLowerCase().includes(params.toLowerCase())) {
			$('#item'+i).hide();
			
		}
		i++;
  		
	}	
	); 
}

function showAllItems(){
		var i = 1;
		$.each(pokeJson.results, function(key,value) {
			$('#item'+i).show();
			i++;
		});
}

function cloneItem(index, result){
	var id = 'item'+(index+1);
	var item = $('#'+id);
	item.on('click', function(){
		$('#popup').fadeIn('slow');
		$('.popup-overlay').fadeIn('slow');
        $('.popup-overlay').height($(window).height());
        buildPopup(index);
	});
	$('#loaderItem').remove();
	item.removeClass('container-item-prev');
	item.addClass('container-item');

	var header = $('<header></header>').addClass('header-container-item');

	var item_header_up = $('<div></div>').addClass('item-header-up');
	var item_header_image = $('<img src='+pokeJson.results[index].pokeData.sprites.front_default +'>').addClass('item-header-up-image');
	var item_header_down = $('<div></div>').addClass('item-header-down');
	item_header_down.text('ID / '+(index+1));

	item_header_up.append(item_header_image);
	header.append(item_header_up);
	header.append(item_header_down);
	item.append(header);

	var footer = $('<footer></footer>').addClass('footer-container-item');
	var item_footer_up = $('<div></div>').addClass('item-footer-up');
	item_footer_up.text(pokeJson.results[index].name);
	var item_footer_center = $('<div></div>').addClass('item-footer-center');
	$.each(pokeJson.results[index].pokeData.types, function(index,value) {
		var type = $('<div></div>').addClass('pokemon-type');
		type.text(value.type.name);
		item_footer_center.append(type);
		//console.log(pokeJson.results[index].pokeData.types);
	});
	if (pokeJson.results[index].evolution.evolves_from_species != null) {
		var item_footer_down = $('<div></div>').addClass('item-footer-down');
		var down_evolution = $('<div></div>').addClass('item-evolution');
		down_evolution.text(STRINGS.evolutionOf);
		var down_evolName = $('<div></div>').addClass('item-evolName');
		down_evolName.text(pokeJson.results[index].evolution.evolves_from_species.name);
		item_footer_down.append(down_evolution);
		item_footer_down.append(down_evolName);
	}
	footer.append(item_footer_up);
	footer.append(item_footer_center);
	footer.append(item_footer_down);
	item.append(footer);
	
	item.hide();
	item.fadeIn(500);


}


function buildPopup(index){
	console.log(pokeJson.results[index]);
	var container = $('#popup_container');
	container.empty();
	var popupImage = $('<img src='+pokeJson.results[index].pokeData.sprites.front_default +'>').addClass('popup-image');
	container.append(popupImage);
	var popupTitle = $('<div></div>').addClass('popup-title');
	popupTitle.text(pokeJson.results[index].name);
	container.append(popupTitle);
	var popupTypes =  $('<div></div>').addClass('popup-types');
	$.each(pokeJson.results[index].pokeData.types, function(index,value) {
		var type = $('<div></div>').addClass('popup-pokemon-type');
		type.text(value.type.name);
		popupTypes.append(type);
		//console.log(pokeJson.results[index].pokeData.types);
	});
	container.append(popupTypes);
	if (pokeJson.results[index].evolution.evolves_from_species != null) {
		var item_footer_down = $('<div></div>').addClass('popup-item-footer-down');
		var down_evolution = $('<div></div>').addClass('popup-item-evolution');
		down_evolution.text(STRINGS.evolutionOf);
		var down_evolName = $('<div></div>').addClass('popup-item-evolName');
		down_evolName.text(pokeJson.results[index].evolution.evolves_from_species.name);
		item_footer_down.append(down_evolution);
		item_footer_down.append(down_evolName);
	}
	container.append(item_footer_down);

}
