angular.module('hex.board', []).directive('board', ['$timeout','testService', ($timeout, testService) ->
  return {
    restrict: 'AC'
    link: (scope, elem, attrs) ->

      hexagonAngle = 0.523598776
      sideLength = 36
      boardWidth = 10
      boardHeight = 10

      hexHeight = Math.sin(hexagonAngle) * sideLength
      hexRadius = Math.cos(hexagonAngle) * sideLength
      hexRectangleHeight = sideLength + 2 * hexHeight
      hexRectangleWidth = 2 * hexRadius


      ctx = elem[0].getContext('2d')
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
            drawHexagon(canvasContext, i * hexRectangleWidth + ((j % 2) * hexRadius), j * (sideLength + hexHeight), false)
            ++j
          ++i
        return
      drawHexagon = (canvasContext, x, y, fill) ->
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
          canvasContext.fill()
        else
          canvasContext.stroke()
        return


      drawBoard(ctx, boardWidth, boardHeight)

      elem[0].addEventListener "mousemove", (eventInfo) ->
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
        ctx.clearRect 0, 0, elem[0].width, elem[0].height
        drawBoard ctx, boardWidth, boardHeight

        # Check if the mouse's coords are on the board
        if hexX >= 0 and hexX < boardWidth
          if hexY >= 0 and hexY < boardHeight
            ctx.fillStyle = "#000000"
            drawHexagon ctx, screenX, screenY, true
        return

  }
])
.directive('tileDir', ->
  return {
    restrict: 'AC'
    templateUrl: 'view/templates/tile'
    scope: {}
    link: (scope, elem, attrs) ->
      console.log('tile')
      scope.select = ->
        scope.selected = true
  }
)
.factory('testService', ->

  return {

  }
)

