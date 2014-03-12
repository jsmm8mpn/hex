angular.module('hex.panzoom', [])
  .factory('panzoom', function() {

    var enablePan = 1; // 1 or 0: enable or disable panning (default enabled)
    var enableZoom = 1; // 1 or 0: enable or disable zooming (default enabled)
    var enableDrag = 0; // 1 or 0: enable or disable dragging (default disabled)
    var zoomScale = 0.2; // Zoom sensitivity

    var boardWidth;
    var boardHeight;
/// <====
/// END OF CONFIGURATION

    var root;

    var state = 'none', svgRoot = null, stateTarget, stateOrigin, stateTf;

    function SVGPan() {

      var bbox = $('#hex-tile')[0].getBBox();
      boardWidth = bbox.width;
      boardHeight = bbox.height;
      setupHandlers();
    }
    /**
     * Register handlers
     */
    function setupHandlers(){

      root = document.getElementById('hex-tile');

      var windowWidth = $(window).width();
      var windowHeight = $(window).height();
      var xDiff = windowWidth - boardWidth;
      var yDiff = windowHeight -boardHeight;
      if (xDiff > 0 || yDiff > 0) {
        var scale;
        if (xDiff > yDiff) {
          scale = windowWidth / boardWidth;
        } else {
          scale = windowHeight / boardHeight;
        }
        var g = $('#viewport')[0];
        var k = root.createSVGMatrix().scale(scale);
        setCTM(g, g.getCTM().multiply(k));
      }


      //setAttributes(root, {
//    "onmouseup" : "handleMouseUp",
//    "onmousedown" : "handleMouseDown",
//    "onmousemove" : "handleMouseMove",
      //"onmouseout" : "handleMouseUp(evt)", // Decomment this to stop the pan functionality when dragging out of the SVG element
      //});

      $('#viewport').on('mouseup',handleMouseUp);
      $('#viewport').on('mousedown',handleMouseDown);
      $('#viewport').on('mousemove',handleMouseMove);

      if(navigator.userAgent.toLowerCase().indexOf('webkit') >= 0)
        window.addEventListener('mousewheel', handleMouseWheel, false); // Chrome/Safari
      else
        window.addEventListener('DOMMouseScroll', handleMouseWheel, false); // Others
    }

    /**
     * Retrieves the root element for SVG manipulation. The element is then cached into the svgRoot global variable.
     */
    function getRoot(root) {
      if(svgRoot == null) {
        var r = root.getElementById("viewport") ? root.getElementById("viewport") : root.documentElement, t = r;

        while(t != root) {
          if(t.getAttribute("viewBox")) {
            setCTM(r, t.getCTM());

            t.removeAttribute("viewBox");
          }

          t = t.parentNode;
        }

        svgRoot = r;
      }

      return svgRoot;
    }

    /**
     * Instance an SVGPoint object with given event coordinates.
     */
    function getEventPoint(evt) {
      var p = root.createSVGPoint();

      p.x = evt.clientX;
      p.y = evt.clientY;

      return p;
    }

    /**
     * Sets the current transform matrix of an element.
     */
    function setCTM(element, matrix) {
      var s = "matrix(" + matrix.a + "," + matrix.b + "," + matrix.c + "," + matrix.d + "," + matrix.e + "," + matrix.f + ")";

      element.setAttribute("transform", s);
    }

    /**
     * Dumps a matrix to a string (useful for debug).
     */
    function dumpMatrix(matrix) {
      var s = "[ " + matrix.a + ", " + matrix.c + ", " + matrix.e + "\n  " + matrix.b + ", " + matrix.d + ", " + matrix.f + "\n  0, 0, 1 ]";

      return s;
    }

    /**
     * Sets attributes of an element.
     */
    function setAttributes(element, attributes){
      for (var i in attributes)
        element.setAttributeNS(null, i, attributes[i]);
    }

    /**
     * Handle mouse wheel event.
     */
    function handleMouseWheel(evt) {
      if(!enableZoom)
        return;

      if(evt.preventDefault)
        evt.preventDefault();

      evt.returnValue = false;

      var svgDoc = evt.target.ownerDocument;

      var delta;

      if(evt.wheelDelta)
        delta = evt.wheelDelta / 360; // Chrome/Safari
      else
        delta = evt.detail / -9; // Mozilla

      var z = Math.pow(1 + zoomScale, delta);

      var g = getRoot(svgDoc);

      var p = getEventPoint(evt);

      p = p.matrixTransform(g.getCTM().inverse());

      // Compute new scale matrix in current mouse position
      var k = root.createSVGMatrix().translate(p.x, p.y).scale(z).translate(-p.x, -p.y);

      var bbox = $('#hex-tile')[0].getBBox();
      boardWidth = bbox.width * z;
      boardHeight = bbox.height * z;

      var xRatio = $(window).width()/boardWidth;
      var yRatio = $(window).height()/boardHeight;
      if (xRatio >= 1 || yRatio >= 1) {
        return;
      }

      var newM = g.getCTM().multiply(k);
      if (newM.e > 0) {
        newM.e = 0;
      }
      if (newM.e < $(window).width()-boardWidth)   {
        newM.e = $(window).width() - boardWidth;
      }
      if (newM.f > 0) {
        newM.f = 0;
      }
      if (newM.f < $(window).height()-boardHeight) {
        newM.f = $(window).height()-boardHeight;
      }
      //console.log(newM);

      setCTM(g, newM);

      if(typeof(stateTf) == "undefined")
        stateTf = g.getCTM().inverse();

      stateTf = stateTf.multiply(k.inverse());
    }

    /**
     * Handle mouse move event.
     */
    function handleMouseMove(evt) {
      if(evt.preventDefault)
        evt.preventDefault();

      evt.returnValue = false;

      var svgDoc = evt.target.ownerDocument;

      var g = getRoot(svgDoc);

      if(state == 'pan' && enablePan) {
        // Pan mode
        var p = getEventPoint(evt).matrixTransform(stateTf);
        var x = p.x - stateOrigin.x;
        var y = p.y - stateOrigin.y;

        var tString = $(this).attr('transform');
        //if (tString) {
        //var m = tString.substr(tString.indexOf('(')+1,tString.indexOf(')')).split(',');


//      if (m[4] + x > 0 || m[4] + 1000 + x < 1500) {
//        return;
//      }
//      if (m[5] + y > 0 || m[5] + 1000 + y < 1500) {
//        return;
//      }
        //}

        //console.log(stateTf.inverse().translate(x,y)                );

        var newM = stateTf.inverse().translate(x,y);
        if (newM.e > 0) {
          newM.e = 0;
        }
        if (newM.e < $(window).width()-boardWidth)   {
          newM.e = $(window).width() - boardWidth;
        }
        if (newM.f > 0) {
          newM.f = 0;
        }
        if (newM.f < $(window).height()-boardHeight) {
          newM.f = $(window).height()-boardHeight;
        }

        setCTM(g, newM);
      } else if(state == 'drag' && enableDrag) {
        // Drag mode
        var p = getEventPoint(evt).matrixTransform(g.getCTM().inverse());

        setCTM(stateTarget, root.createSVGMatrix().translate(p.x - stateOrigin.x, p.y - stateOrigin.y).multiply(g.getCTM().inverse()).multiply(stateTarget.getCTM()));

        stateOrigin = p;
      }
    }

    /**
     * Handle click event.
     */
    function handleMouseDown(evt) {
      if(evt.preventDefault)
        evt.preventDefault();

      evt.returnValue = false;

      var svgDoc = evt.target.ownerDocument;

      var g = getRoot(svgDoc);

      if(
        evt.target.tagName == "svg"
          || !enableDrag // Pan anyway when drag is disabled and the user clicked on an element
        ) {
        // Pan mode
        state = 'pan';

        stateTf = g.getCTM().inverse();

        stateOrigin = getEventPoint(evt).matrixTransform(stateTf);
      } else {
        // Drag mode
        state = 'drag';

        stateTarget = evt.target;

        stateTf = g.getCTM().inverse();

        stateOrigin = getEventPoint(evt).matrixTransform(stateTf);
      }
    }

    /**
     * Handle mouse button release event.
     */
    function handleMouseUp(evt) {
      if(evt.preventDefault)
        evt.preventDefault();

      evt.returnValue = false;

      var svgDoc = evt.target.ownerDocument;

      if(state == 'pan' || state == 'drag') {
        console.log('here')
        // Quit pan mode
        state = '';
      }
    }


    return {
      start: function() {
        SVGPan();
      }
    }
  })
