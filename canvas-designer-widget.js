var CanvasDesigner = (function() {
    var iframe;
    var tools = {
        line: true,
        pencil: true,
        dragSingle: true,
        dragMultiple: true,
        eraser: true,
        rectangle: true,
        arc: true,
        bezier: true,
        quadratic: true,
        text: true
    };
    var selectedIcon = 'pencil';

    function syncData(data) {
        if (!iframe) return;

        iframe.contentWindow.postMessage({
            canvasDesignerSyncData: data
        }, '*');
    }

    var syncDataListener = function(data) {};
    var dataURLListener = function(dataURL) {};
    
    function onMessage(event) {
        if(!event.data) return;

        if (!!event.data.canvasDesignerSyncData) {
            syncDataListener(event.data.canvasDesignerSyncData);
        }

        if (!!event.data.dataURL) {
            dataURLListener(event.data.dataURL);
        }
    }

    window.addEventListener('message', onMessage, false);

    return {
        appendTo: function(parentNode) {
            iframe = document.createElement('iframe');
            iframe.src = 'widget.html?tools=' + JSON.stringify(tools) + '&selectedIcon=' + selectedIcon;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 0;
            parentNode.appendChild(iframe);
        },
        destroy: function() {
            if(iframe) {
                iframe.parentNode.removeChild(iframe);
            }
            window.removeEventListener('message', onMessage);
        },
        addSyncListener: function(callback) {
            syncDataListener = callback;
        },
        syncData: syncData,
        setTools: function(_tools) {
            tools = _tools;
        },
        setSelected: function(icon) {
            if (typeof tools[icon] !== 'undefined') {
                selectedIcon = icon;
            }
        },
        toDataURL: function(format, callback) {
            dataURLListener = callback;
            if (!iframe) return;
            iframe.contentWindow.postMessage({
                genDataURL: true,
                format: format
            }, '*');
        }
    };
})();
