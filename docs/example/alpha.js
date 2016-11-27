(function(){
    var Alpha = {
        mask : function(elm){
            var replace = function(original, mask){
                var canvas = document.createElement("canvas");
                canvas.setAttribute("width", original.naturalWidth);
                canvas.setAttribute("height", original.naturalHeight);
                
                var con = canvas.getContext("2d");
                con.drawImage(mask, 0, 0);
                
                var maskImageData = con.getImageData(0, 0, original.naturalWidth, original.naturalHeight);
                
                con.drawImage(original, 0, 0);
                var mainImageData = con.getImageData(0, 0, original.naturalWidth, original.naturalHeight);
                
                for(var i=0; i<mainImageData.data.length; i+=4){
                    (function(pos){
                        mainImageData.data[pos + 3] = maskImageData.data[pos];
                    })(i);
                }
                con.putImageData(mainImageData, 0, 0);
                
                original.dataset.originalImage = original.getAttribute("src");
                original.src = canvas.toDataURL("image/png");
            };
            var mask = new Image();
            mask.addEventListener("load", function(){
                replace(elm, mask);
            }, false);
            mask.src = elm.dataset.alphaMask;
        }
    };
    document.addEventListener("DOMContentLoaded", function(){
        var alphaElements = document.querySelectorAll('[data-alpha-mask]');
        for(var i=0; i<alphaElements.length; i++){
            (function(elm){
                var mask = function(){
                    Alpha.mask(elm);
                };
                if(!elm.complete){
                    console.log("info:elm.addEventListener");
                    elm.addEventListener("load", mask, false);
                }
                else{
                    mask();
                }
            })(alphaElements[i]);
        }
    }, false);
})();