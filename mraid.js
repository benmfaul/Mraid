console = {};

console.log = function(log)
{
    AdWebView.log(log);
}; 

console.debug = console.log;
console.info = console.log;
console.warn = console.log;
console.error = console.log;  


window.mraid_init = function()
{
    console.log('mraid_init');
    
    var mraid = window.mraid = {};
    
    // MAST SDK
    mraid.returnResult = function(call)
    {
        return call().toString();
    };
    
    // MAST SDK
    mraid.returnInfo = function(call)
    {
        var info = '';
        
        var result = call();
        for (property in result)
        {
            if (info)
            {
                info += '&';
            }
            
            info += encodeURIComponent(property) + '=' +
                    encodeURIComponent(result[property]);
        }
        
        return info;
    };
    

    /////////
    //
    // events
    //
    
    var EVENTS = mraid.EVENTS = {
        READY                   :"ready",
        ERROR                   :"error",
        STATE_CHANGE            :"stateChange",
        VIEWABLE_CHANGE         :"viewableChange",
        SIZE_CHANGE             :"sizeChange"
    };
    
    var listeners = {};

    // MRAID
    mraid.addEventListener = function(event, listener)
    {
        console.log("addEventListener " + event);
        
        var handlers = listeners[event];
        
        // Create the listeners for the event if not already created
        if (!handlers)
        {
            listeners[event] = [];
            handlers = listeners[event];
        }
        
        // Don't add the same listener twice
        for (var i = 0; i < handlers.length; ++i)
        {
            if (listener === handlers[i])
            {
                return;
            }
        }
        
        // Add the new listener
        handlers.push(listener);
    };
    
    // MRAID
    mraid.removeEventListener = function(event, listener)
    {
        console.log("removeEventListener");
        
        var handlers = listeners[event];
        if (handlers)
        {
            //handlers.remove(listener); // XXX not supported
            var idx = handlers.indexOf(listener);
            if (idx != -1)
            {
                handlers.splice(idx, 1); // remove by splicing out
            }
            else
            {
                if (!listener)
                {
                        // if no specific listener, remove all for the event
                        listeners[event] = [];
                        }
            }
        }
    };
    
    // MRAID / MAST SDK (for size change)
    mraid.fireChangeEvent = function(event, newValue)
    {
        console.log("fireChangeEvent handler:" + event + " with:" + newValue);
        
        var handlers = listeners[event];
        if (handlers)
        {
            for (var i = 0; i < handlers.length; ++i)
            {
                handlers[i](newValue);
            }
        }
    };

    // MRAID / MAST SDK
    mraid.fireSizeChangeEvent = function(width, height)
    {
       console.log("fireSizeChangeEvent, with:" + width + ", " + height);
    
        var handlers = listeners[EVENTS.SIZE_CHANGE];
        if (handlers)
        {
            for (var i = 0; i < handlers.length; ++i)
            {
                handlers[i](width, height);
            }
        }
    };
    
    // MAST SDK
    mraid.fireErrorEvent = function(message, action)
    {
        console.log("fireErrorEvent handler:" + message + " action:" + action);
        
        var handlers = listeners[EVENTS.ERROR];
        if (handlers)
        {
            for (var i = 0; i < handlers.length; ++i)
            {
                handlers[i](message, action);
            }
        }
    };
    
    // MAST SDK
    mraid.fireEvent = function(event)
    {
        console.log("fireEvent handler:" + event);
        
        var handlers = listeners[event];
        if (handlers)
        {
            for (var i = 0; i < handlers.length; ++i)
            {
                handlers[i]();
            }
        }
    };
    
    
    /////////
    //
    // version
    //
    
    // MRAID
    mraid.getVersion = function()
    {
        console.log("getVersion");
        
        return ("2.0");
    };
    
    
    //////////
    //
    // supports
    //
    
    var FEATURES = mraid.FEATURES = {
        SMS             :"sms",
        PHONE           :"tel",
        EMAIL           :"email",
        CALENDAR        :"calendar",
        STORE_PICTURE   :"storePicture",
        INLINE_VIDEO    :"inlineVideo"
    };
    
    var supportedFeatures = {};
    
    // MAST SDK
    mraid.setSupports = function(feature, supported)
    {
        supportedFeatures[feature] = supported;
    };
    
    // MRAID
    mraid.supports = function(feature)
    {
        console.log("supports:" + feature);
        
        return supportedFeatures[feature];
    };
    
    
    /////////
    //
    // state
    //
    
    var STATES = mraid.STATES = {
        LOADING     :"loading",
        DEFAULT     :"default",
        EXPANDED    :"expanded",
        RESIZED     :"resized",
        HIDDEN      :"hidden"
    };
    
    var state = STATES.LOADING;
    
    // MAST SDK
    mraid.setState = function(newState)
    {
        var diff = state != newState;
        
        state = newState;
        
        if (diff)       // XXX spec says resized -> resized fires an event
        {
            mraid.fireChangeEvent(EVENTS.STATE_CHANGE, state);
        }
    };
    
    // MRAID
    mraid.getState = function()
    {
        console.log("getState");
        
        return state;
    };
    
    
    /////////
    //
    // placementType
    //
    
    var PLACEMENT_TYPES = mraid.PLACEMENT_TYPES = {
        INLINE          :"inline",
        INTERSTITIAL    :"interstitial"
    };
    
    var placementType = PLACEMENT_TYPES.INLINE;
    
    // MAST SDK
    mraid.setPlacementType = function(newPlacementType)
    {
        placementType = newPlacementType;
    };
    
    // MRAID
    mraid.getPlacementType = function()
    {
        console.log("getPlacementType");
        
        return placementType;
    };
    
    
    //////////
    //
    // isViewable
    //
    
    var isViewable = false;
    
    // MAST SDK
    mraid.setViewable = function(viewable)
    {
        var diff = isViewable != viewable;
        
        isViewable = viewable;
        
        if (diff)
        {
            //mraid.fireEventListener(EVENTS.VIEWABLE_CHANGE, isViewable);
            mraid.fireChangeEvent(EVENTS.VIEWABLE_CHANGE, isViewable);
        }
    };
    
    // MRAID
    mraid.isViewable = function()
    {
        console.log("isViewable");
        
        return isViewable;
    };
    
    
    //////////
    //
    // open
    //
    
    // MRAID
    mraid.open = function(url)
    {
                console.log("open");

                AdWebView.open(encodeURIComponent(url));
    };
    
    
    //////////
    //
    // close
    //
    
    // MRAID
    mraid.close = function()
    {
                console.log("close");

                AdWebView.close();
    };



    //////////
    //
    // orientation Properties (expand/interstitial)
    //
    
    var ORIENTATION_PROPERTIES_FORCE_ORIENTATION = mraid.ORIENTATION_PROPERTIES_FORCE_ORIENTATION = {
        PORTRAIT    :"portrait",
        LANDSCAPE   :"landscape",
        NONE        :"none"
    };
    
    var orientationProperties = {
        allowOrientationChange:true,
        forceOrientation:ORIENTATION_PROPERTIES_FORCE_ORIENTATION.NONE
    };
    
    // MRAID
    mraid.setOrientationProperties = function(properties)
    {
        console.log("setOrientationProperties");
        
        var writableFields = ["allowOrientationChange", "forceOrientation"];
        
        for (wf in writableFields)
        {
            var field = writableFields[wf];
            if (properties[field] !== undefined)
            {
                expandProperties[field] = properties[field];
            }
        }
    
                AdWebView.setOrientationProperties(mraid.returnInfo(mraid.getOrientationProperties));
    };
    
    // MRAID
    mraid.getOrientationProperties = function()
    {
        console.log("getOrientationProperties");
        
        return expandProperties;
    };
    
    
    //////////
    //
    // expand
    //
    
    var expandProperties = {
        width:0,
        height:0,
        useCustomClose:false,
        isModal:true,
    };
    
    // MRAID
    mraid.setExpandProperties = function(properties)
    {
        console.log("setExpandProperties");
        
        var writableFields = ["width", "height", "useCustomClose"];
        
        for (wf in writableFields)
        {
            var field = writableFields[wf];
            if (properties[field] !== undefined)
            {
                expandProperties[field] = properties[field];
            }
        }
    
                AdWebView.setExpandProperties(mraid.returnInfo(mraid.getExpandProperties));
    };
    
    // MRAID
    mraid.getExpandProperties = function()
    {
        console.log("getExpandProperties");
        
        return expandProperties;
    };
    
    // MRAID
    mraid.useCustomClose = function(useCustomClose)
    {
        console.log("useCustomClose");
        
        var property = { useCustomClose : useCustomClose };
        
        mraid.setExpandProperties(property);
    };
    
    // MRAID
    mraid.expand = function(url)
    {
        console.log("expand, state = " + state);
        AdWebView.expand(encodeURIComponent(url));
    };
    
    
    //////////
    //
    // resize 
    //
    
    var RESIZE_PROPERTIES_CUSTOM_CLOSE_POSITION = 
      mraid.RESIZE_PROPERTIES_CUSTOM_CLOSE_POSITION = {
        TOP_LEFT        :"top-left",
        TOP_RIGHT       :"top-right",
        CENTER          :"center",
        BOTTOM_LEFT     :"bottom-left",
        BOTTOM_RIGHT    :"bottom-right"
    };
    
    var resizeProperties = {
        width:0,
        height:0,
        customClosePosition: RESIZE_PROPERTIES_CUSTOM_CLOSE_POSITION.TOP_RIGHT,
        offsetX:0,
        offsetY:0,
        allowOffscreen:false
    };
    
    // MRAID
    mraid.setResizeProperties = function(properties, sizeIsPixels)
    {
        console.log("setResizeProperties");
        
        var writableFields = ["width", "height", "customClosePosition", "offsetX", "offsetY", "allowOffscreen"];
        
        for (wf in writableFields)
        {
            var field = writableFields[wf];
            if (properties[field] !== undefined)
            {
                resizeProperties[field] = properties[field];
            }
        }
        
        // XXX NOTE: sizeIsPixels is a hack for supporting ormma resize(width,height)
        // XXX should not need this in production for MRAID 2 only!!!
        if (typeof sizeIsPixels != "undefined")
        {
                        AdWebView.setResizeProperties(mraid.returnInfo(mraid.getResizeProperties), sizeIsPixels);
                }
                else
                {
                        AdWebView.setResizeProperties(mraid.returnInfo(mraid.getResizeProperties), "false");
                }       
    };
    
    // MRAID
    mraid.getResizeProperties = function()
    {
        console.log("getResizeProperties");
        
        return resizeProperties;
    };
    
    // ORMMA compatible resize(), also works with mraid no parameter version
    mraid.resize = function(toWidth, toHeight)
    {
                if (typeof toWidth != "undefined")
                {
                        //console.log("resize with width/height: " + width + ", " + height);
                
                        if (typeof toHeight != "undefined")
                        {
                                console.log("resize with width/height: " + toWidth + ", " + toHeight);
                                var rp = { width : toWidth, height : toHeight };
                                mraid.setResizeProperties( rp, "true" );
                        }
                        else
                        {
                                console.log("resize with width/height: " + width);
                                var rp = { width : toWidth };
                                mraid.setResizeProperties( rp, "true" );
                        }
                }
                else
                {
                        console.log("mraid style resize");
                }
                
                AdWebView.resize();
    };
    
    // MRAID
    //mraid.resize = function()
    //{
        //      console.log("resize");
        //
        //      AdWebView.setResizeProperties(mraid.returnInfo(mraid.getResizeProperties)); // use defaults
        //              
        //      AdWebView.resize();
    //}

    //////////
    //
    // position and size
    //
    
    var currentPosition = {
        x:0,
        y:0,
        width:0,
        height:0
    };
    
    var maxSize = {
        width:0,
        height:0
    };
    
    var defaultPosition = {
        x:0,
        y:0,
        width:0,
        height:0
    };
    
    var screenSize = {
        width:0,
        height:0
    };
    
    var currentOrientation = 0;
    
    // MAST SDK
    mraid.setCurrentPosition = function(position)
    {
        var previousSize = mraid.getSize();
        
        currentPosition = position;
        
        var currentSize = mraid.getSize();
        
        // Only send the size changed event if the size in the position
        // was different from the previous position
        if ((previousSize.width === currentSize.width) && (previousSize.height === currentSize.height))
        {
            return;
        }
        
        mraid.fireSizeChangeEvent(currentPosition.width, currentPosition.height); 
    };
    
    // MRAID
    mraid.getCurrentPosition = function()
    {
        console.log("getCurrentPosition");
        
        var position = AdWebView.getCurrentPosition();
        if (typeof position != "undefined")
        {
                currentPosition = position;
        }
        
        return currentPosition;
    };
    
    // MRAID
    mraid.getSize = function()
    {
        console.log("getSize");
        
        
        var position = AdWebView.getCurrentPosition();
        if (typeof position != "undefined")
        {
                currentPosition = position;
        }
        
        var size = 
        {
            width:currentPosition.width,
            height:currentPosition.height
        };
        
        return size;
    };
    
    // MAST SDK
    mraid.setMaxSize = function(size)
    {
        maxSize = size;
    };
    
    // MRAID
    mraid.getMaxSize = function()
    {
        console.log("getMaxSize");
        
        return maxSize;
    };
    
    // MAST SDK
    mraid.setDefaultPosition = function(position)
    {
        defaultPosition = position;
    };
    
    // MRAID
    mraid.getDefaultPosition = function()
    {
        console.log("getDefaultPosition");
        
        return defaultPosition;
    };
    
    // MAST SDK
    mraid.setScreenSize = function(size)
    {
        screenSize = size;
    };
    
    // MRAID
    mraid.getScreenSize = function()
    {
        console.log("getScreenSize");
        
        return screenSize;
    };
    
    // MAST SDK 
    mraid.setOrientation = function(orientation)
    {
        currentOrientation = orientation;
    };
    
    // MRAID
    mraid.getOrientation = function()
    {
        console.log("getOrientation");
      
        var o = AdWebView.getOrientation();
        mraid.setOrientation(o);
           
        return currentOrientation;
    };
    
    //////////
        //
        // Store picture

        // MRAID
        mraid.storePicture = function(url)
        {
                if (mraid.support(FEATURES.STORE_PICTURE))
                {
                        console.log("store picture: " + url);
                
                        AdWebView.storePicture(url);
                }
                else
                {
                        console.log("store picture: requested but not supported");
                }               
        };


        //////////
        //
        // Create a calendar event
        
        mraid.createCalendarEvent = function(parameters)
        {
                if (mraid.support(FEATURES.CALENDAR))
                {
                        console.log("create calendar event: " + parameters);
                
                        AdWebView.createCalendarEntry(mraid.returnInfo(parameters));
                }
                else
                {
                        console.log("create calendar event: requested but not supported");
                }
        }    

        //////////
        //
        // Media playback using external player (for inline playback. use HTML5 tags)

        // MRAID
        mraid.playVideo = function(url)
        {
                console.log("play video: " + url);
                
                AdWebView.playVideo(url);
        }
        
                    
        // end of mraid_init routine
};

        

if (!window.mraid)
{
    window.mraid_init();
}
