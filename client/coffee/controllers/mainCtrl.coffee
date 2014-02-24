@MainCtrl = ['$scope', '$timeout', ($scope, $timeout) ->

  $scope.zoomIn = ->
    $('.board').panzoom("zoom");
  $scope.zoomOut = ->
    $('.board').panzoom("zoom", true);
  $timeout ->

    hexagonAngle = 0.523598776
    sideLength = 36
    boardWidth = 30
    boardHeight = 30

    hexHeight = Math.sin(hexagonAngle) * sideLength
    hexRadius = Math.cos(hexagonAngle) * sideLength
    hexRectangleHeight = sideLength + 2 * hexHeight
    hexRectangleWidth = 2 * hexRadius


    ctx = $('.board')[0].getContext('2d')
    ctx.fillStyle = "#000000"
    ctx.strokeStyle = "#CCCCCC"
    ctx.lineWidth = 1

    drawBoard = (canvasContext, width, height) ->
      i = undefined
      j = undefined
      i = 0
      while i < width
        j = 0
        while j < height
          drawHexagon(canvasContext, i * hexRectangleWidth + ((j % 2) * hexRadius), j * (sideLength + hexHeight), false, i, j)
          ++j
        ++i
      return
    drawHexagon = (canvasContext, x, y, fill, i, j) ->
      fill = fill or false
      canvasContext.beginPath()
      canvasContext.moveTo x + hexRadius, y
      canvasContext.lineTo x + hexRectangleWidth, y + hexHeight
      canvasContext.lineTo x + hexRectangleWidth, y + hexHeight + sideLength
      canvasContext.lineTo x + hexRadius, y + hexRectangleHeight
      canvasContext.lineTo x, y + sideLength + hexHeight
      canvasContext.lineTo x, y + hexHeight
      canvasContext.closePath()
      if fill
        canvasContext.fillStyle = '#000000'
        canvasContext.fill()
      else
        canvasContext.fillStyle = '#FFFFFF'
        canvasContext.fill()
        canvasContext.stroke()
      canvasContext.fillStyle = '#000000'
      canvasContext.fillText(i+','+j, x+30, y+40)
      return


    drawBoard(ctx, boardWidth, boardHeight)

    oldX = undefined
    oldY = undefined

    $('.board')[0].addEventListener "mousemove", (eventInfo) ->
      x = undefined
      y = undefined
      hexX = undefined
      hexY = undefined
      screenX = undefined
      screenY = undefined
      x = eventInfo.offsetX or eventInfo.layerX
      y = eventInfo.offsetY or eventInfo.layerY
      hexY = Math.floor(y / (hexHeight + sideLength))
      hexX = Math.floor((x - (hexY % 2) * hexRadius) / hexRectangleWidth)
      screenX = hexX * hexRectangleWidth + ((hexY % 2) * hexRadius)
      screenY = hexY * (hexHeight + sideLength)
      #ctx.clearRect 0, 0, this.width, this.height
      #drawBoard ctx, boardWidth, boardHeight

      if oldX != undefined or (oldX != hexX or oldY != hexY)

        if oldX != undefined
          oldScreenX = oldX * hexRectangleWidth + ((oldY % 2) * hexRadius)
          oldScreenY = oldY * (hexHeight + sideLength)
          drawHexagon ctx, oldScreenX, oldScreenY, false, oldX, oldY

        # Check if the mouse's coords are on the board
        if hexX >= 0 and hexX < boardWidth
          if hexY >= 0 and hexY < boardHeight
            #ctx.fillStyle = "#000000"
            drawHexagon ctx, screenX, screenY, true, hexX, hexY
            oldX = hexX
            oldY = hexY


      return


    $('.board').panzoom({
      contain: true
    })
]
