angular.module('hex.panzoom', [])
  .directive('panzoom', function() {

    var zoomScale = 0.2; // Zoom sensitivity

    var boardWidth;
    var boardHeight;

    var root;

    var state = 'none', svgRoot = null, stateOrigin, stateTf;

    function SVGPan(elm) {

      var bbox = elm[0].getBBox();
      boardWidth = bbox.width;
      boardHeight = bbox.height;

      root = elm.parent()[0];
      svgRoot = elm[0];

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
        var g = elm[0];
        var k = root.createSVGMatrix().scale(scale);
        setCTM(g, g.getCTM().multiply(k));
      }

      elm.on('mouseup',handleMouseUp);
      elm.on('mousedown',handleMouseDown);
      elm.on('mousemove',handleMouseMove);

      if(navigator.userAgent.toLowerCase().indexOf('webkit') >= 0)
        window.addEventListener('mousewheel', handleMouseWheel, false); // Chrome/Safari
      else
        window.addEventListener('DOMMouseScroll', handleMouseWheel, false); // Others
    }

    function getEventPoint(evt) {
      var p = root.createSVGPoint();
      p.x = evt.clientX;
      p.y = evt.clientY;
      return p;
    }

    function setCTM(element, matrix) {
      var s = "matrix(" + matrix.a + "," + matrix.b + "," + matrix.c + "," + matrix.d + "," + matrix.e + "," + matrix.f + ")";
      element.setAttribute("transform", s);
    }

    function handleMouseWheel(evt) {

      if(evt.preventDefault)
        evt.preventDefault();

      var delta;

      if(evt.wheelDelta)
        delta = evt.wheelDelta / 360; // Chrome/Safari
      else
        delta = evt.detail / -9; // Mozilla

      var z = Math.pow(1 + zoomScale, delta);

      var p = getEventPoint(evt);

      p = p.matrixTransform(svgRoot.getCTM().inverse());

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

      var newM = svgRoot.getCTM().multiply(k);
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

      setCTM(svgRoot, newM);

      if(typeof(stateTf) == "undefined")
        stateTf = svgRoot.getCTM().inverse();

      stateTf = stateTf.multiply(k.inverse());
    }

    function handleMouseMove(evt) {
      if(evt.preventDefault)
        evt.preventDefault();

      if(state == 'pan') {
        var p = getEventPoint(evt).matrixTransform(stateTf);
        var x = p.x - stateOrigin.x;
        var y = p.y - stateOrigin.y;

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

        setCTM(svgRoot, newM);
      }
    }

    function handleMouseDown(evt) {
      if(evt.preventDefault)
        evt.preventDefault();

      state = 'pan';
      stateTf = svgRoot.getCTM().inverse();
      stateOrigin = getEventPoint(evt).matrixTransform(stateTf);
    }

    function handleMouseUp(evt) {
      if(evt.preventDefault)
        evt.preventDefault();

      if(state == 'pan') {
        state = '';
      }
    }


    return {
      restrict: 'A',
      scope: {

      },
      link: function(scope, elem, attrs) {
        SVGPan($(elem));
      }
    }
  })
