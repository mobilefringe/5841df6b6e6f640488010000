function init() {
    renderHomeHours();
    
    var feature_items = getFeatureList();
    var item = feature_items.slice(0,1);
    renderFeatureItems('#feature_item','#feature_item_template', item);
}

function renderBanner(home_banner_template, home_banner, banners){
    var item_list = [];
    var item_rendered = [];
    var banner_template_html = $(home_banner_template).html();
    Mustache.parse(banner_template_html);   // optional, speeds up future uses
    $.each(banners, function(key, val) {
        today = new Date();
        start = new Date (val.start_date);
       
        start.setDate(start.getDate());
        if(val.url == "" || val.url === null){
            val.css = "style=cursor:default;";
            val.noLink = "return false";
        }
        if (start <= today){
            if (val.end_date){
                end = new Date (val.end_date);
                end.setDate(end.getDate() + 1);
                if (end >= today){
                    item_list.push(val);  
                }
            } else {
                item_list.push(val);
            }
        }
    });
    $.each( item_list , function( key, val ) {
        var repo_rendered = Mustache.render(banner_template_html,val);
        item_rendered.push(repo_rendered);
    });
    $(home_banner).html(item_rendered.join(''));
}

function renderFeatureItems(feature_item, feature_item_template, feature_items){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(feature_item_template).html();
    Mustache.parse(template_html); 
    $.each(feature_items, function(key, val) {
        // if (val.description.length  >= 100) {
        //     val.description = val.description.substring(0,99) + "...";
        // }
        if(val.url == "" || val.url === null){
           val.css = "style=cursor:default;";
           val.noLink = "return false";
        }
        var repo_rendered = Mustache.render(template_html,val);
        item_rendered.push(repo_rendered);
    });
    $(feature_item).html(item_rendered.join(''));
}

function renderHours(container, template, collection, type){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    if (type == "reg_hours") {
        $.each( collection , function( key, val ) {
            if (!val.store_id && val.is_holiday == false) {
                switch(val.day_of_week) {
                    case 0:
                        val.day = "Sunday";
                        break;
                    case 1:
                        val.day = "Monday";
                        break;
                    case 2:
                        val.day = "Tuesday";
                        break;
                    case 3:
                        val.day = "Wednesday";
                        break;
                    case 4:
                        val.day = "Thursday";
                        break;
                    case 5:
                        val.day = "Friday";
                        break;
                    case 6:
                        val.day = "Saturday";
                        break;
                }
                if (val.open_time && val.close_time && val.is_closed == false){
                    var open_time = moment(val.open_time).tz(getPropertyTimeZone());
                    var close_time = moment(val.close_time).tz(getPropertyTimeZone());
                    val.h = open_time.format("h:mma") + " - " + close_time.format("h:mma")
                } else {
                    "Closed";
                }
                item_list.push(val);
            }
        });
        collection = [];
        collection = item_list;
    }
    
    if (type == "holiday_hours") {
        $.each( collection , function( key, val ) {
            if (!val.store_id && val.is_holiday == true) {
                holiday = moment(val.holiday_date).tz(getPropertyTimeZone());
                val.formatted_date = holiday.format("MM/DD/YY");
                if (val.open_time && val.close_time && val.is_closed == false){
                    var open_time = moment(val.open_time).tz(getPropertyTimeZone());
                    var close_time = moment(val.close_time).tz(getPropertyTimeZone());
                    val.h = open_time.format("h:mma") + " - " + close_time.format("h:mma");   
                } else {
                    val.h = "Closed";
                }
                item_list.push(val);
            }
        });
        collection = [];
        collection = item_list;
    }
    $.each( collection , function( key, val ) {
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).show();
    $(container).html(item_rendered.join(''));
}

function renderHomeHours(container, template, collection){
    var today_hours = getTodaysHours();
    var item_list = [];
    var item_rendered = [];
    var template_html = $('#home_hours_template').html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    item_list.push(today_hours);    
    $.each(item_list, function(key, val) {
        val.day = moment().date();
        var d = moment();
        val.month = moment().month();
        val.weekday = moment().format("dddd");
        if (val.open_time && val.close_time && (val.is_closed == false || val.is_closed == null)){
            var open_time = moment(val.open_time).tz(getPropertyTimeZone());
            var close_time = moment(val.close_time).tz(getPropertyTimeZone());
            val.h = open_time.format("h:mma") + " - " + close_time.format("h:mma");
            val.close_time = close_time.format("h:mma");
        } else {
            val.h = "Closed";
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $('#home_hours_container').html(item_rendered.join(''));
}