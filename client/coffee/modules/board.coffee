angular.module('hex.board', []).directive('board', ['$timeout','testService', ($timeout, testService) ->
  return {
    restrict: 'AC'
    templateUrl: 'view/templates/board'
    scope:
      rows: '='
      cols: '='
      size: '='
      padding: '='
    link: (scope, elem, attrs) ->

      size = scope.size
      padding = scope.padding

      degreesToRadians = (degrees) -> degrees * Math.PI / 180

      r = size * Math.cos(degreesToRadians(30))
      h = size * Math.sin(degreesToRadians(30))
      d = padding / 2 / Math.tan(degreesToRadians(30))

      tileWidth  = (4 * r) + (2 * padding)
      tileHeight = (2 * h) + (2 * size) + (2 * d)

      calculateHexTile= ->
        originX = -r - (padding / 2)
        originY = -h - (size / 2)

        vertices = []

        for row in [0...scope.rows]
          for col in [0...scope.cols]
            [x, y] = calculateXY(originX, originY, col, row)
            vertices.push(calculateHexVertices(x, y))

        vertices

      calculateXY = (x, y, col, row) ->
        width  = (2 * r) + padding
        height = size + h + d

        [
          x + (col * width) + ((row % 2) * (width / 2))
          y + (row * height)
        ]

      createPoints = (x, y) ->
        x+','+y + ' ' + (x+r)+','+(y+h)+' '+(x+r)+','+(y+size+h)+' '+x+','+(y+size+h+h)+' '+(x-r)+','+(y+size+h)+' '+(x-r)+','+(y+h)

      calculateHexVertices = (x, y) ->
        [
          [x,      y                  ]
          [x + r, y + h             ]
          [x + r, y + size + h     ]
          [x,      y + size + h + h]
          [x - r, y + size + h     ]
          [x - r, y + h             ]
        ]

      vertices = calculateHexTile()

      scope.vertices = vertices

#        d3
#          .select("#hex-tile")
#          .attr("width",  tileWidth)
#          .attr("height", tileHeight)

#        polygon = d3.select("#hex-tile").selectAll("polygon").data(vertices).enter().append('svg:polygon')
#        polygon.attr("points", (d, i) -> d.join(" ")).on("mousemove", ->
#          d3.select(this).attr('style', 'fill:#000000')
#        )
        #polygon.enter().append("svg:polygon")
        #polygon.attr("points", (d, i) -> d.join(" "))



#        d3
#        .select("#hex-tile")
#        .attr("width",  1000)
#        .attr("height", 600)


      #$(elem).on('mousewheel', mouseWheelHandler)
      $timeout ->
        SVGPan()

  }
])
.directive('polygon', ['$timeout', ($timeout) ->
  return {
    restrict: 'EAC'
    #templateUrl: 'view/templates/tile'
    #replace: true
    scope:
      vertice: '='
    link: (scope, elem, attrs) ->
      points = ''
      for point in scope.vertice
        points += point[0]+','+point[1] + ' '

      $(elem).attr('points', points)
      $(elem).click ->
        console.log('click')
  }
])
.factory('testService', ->

  return {
    sayHello: ->
      console.log('hello')
  }
)

