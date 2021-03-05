;(function() {
  var PageController = function() {
    var canvas,
      previewCanvas,
      cell_height,
      cell_width,
      map = {},
      nextCubeItem,
      nextCubetype,
      timer,
      shouldStop = false,
      gaming = false,
      score = 0
    var emptyCell = {
      x: 0,
      y: 0,
      color: "#ffffff",
      canMove: true,
      groupId: "",
      groupType: "",
      rotation: ""
    }
    var set = {
      canvasSeletor: "#canvas",
      previewCanvasSeletor: "#preview-canvas",
      grid_cols: 12,
      grid_rows: 20,
      lineWidth: 1,
      ctxStrokeStyle: "#a0a0a0",
      spaceTime: 300,
      startX: 6,
      startY: 0
    }
    var moveType = {
      LEFT: "left",
      DOWN: "down",
      RIGHT: "right",
      UP: "up"
    }
    var colorSet = {
      red: "#940009",
      yellow: "#9ab709",
      blue: "#1200c7",
      purple: "#673ab7",
      green: "#4caf50",
      orange: "#ffc107",
      lightGreen: "#24c58c"
    }
    var ROTATION_TYPE = {
      TYPE1: "type1",
      TYPE2: "type2",
      TYPE3: "type3",
      TYPE4: "type4"
    }
    var CUBE_INFO = {
      cube1: {
        name: "flash",
        bodyArray: function(type) {
          switch (type) {
            case ROTATION_TYPE.TYPE1:
            case ROTATION_TYPE.TYPE3:
              return [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }]
            case ROTATION_TYPE.TYPE2:
            case ROTATION_TYPE.TYPE4:
              return [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 1 }]
          }
        },
        color: colorSet.yellow
      },
      cube2: {
        name: "b",
        bodyArray: function(type) {
          switch (type) {
            case ROTATION_TYPE.TYPE1:
              return [{ x: 0, y: 0 }, { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }]
            case ROTATION_TYPE.TYPE2:
              return [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 1 }]
            case ROTATION_TYPE.TYPE3:
              return [{ x: 0, y: 1 }, { x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }]
            case ROTATION_TYPE.TYPE4:
              return [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: -1, y: 1 }]
          }
        },
        color: colorSet.purple
      },
      cube3: {
        name: "line",
        bodyArray: function(type) {
          switch (type) {
            case ROTATION_TYPE.TYPE1:
            case ROTATION_TYPE.TYPE3:
              return [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }]
            case ROTATION_TYPE.TYPE2:
            case ROTATION_TYPE.TYPE4:
              return [{ x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }]
          }
        },
        color: colorSet.blue
      },
      cube4: {
        name: "l",
        bodyArray: function(type) {
          switch (type) {
            case ROTATION_TYPE.TYPE1:
              return [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }]
            case ROTATION_TYPE.TYPE2:
              return [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 1 }]
            case ROTATION_TYPE.TYPE3:
              return [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }]
            case ROTATION_TYPE.TYPE4:
              return [{ x: 0, y: 1 }, { x: -1, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 0 }]
          }
        },
        color: colorSet.lightGreen
      },
      cube5: {
        name: "reFlash",
        bodyArray: function(type) {
          switch (type) {
            case ROTATION_TYPE.TYPE1:
            case ROTATION_TYPE.TYPE3:
              return [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 1 }, { x: -1, y: 2 }]
            case ROTATION_TYPE.TYPE2:
            case ROTATION_TYPE.TYPE4:
              return [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }]
          }
        },
        color: colorSet.green
      },
      cube6: {
        name: "square",
        bodyArray: function(type) {
          switch (type) {
            case ROTATION_TYPE.TYPE1:
            case ROTATION_TYPE.TYPE2:
            case ROTATION_TYPE.TYPE3:
            case ROTATION_TYPE.TYPE4:
              return [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 1, y: 1 }]
          }
        },
        color: colorSet.red
      },
      cube7: {
        name: "reL",
        bodyArray: function(type) {
          switch (type) {
            case ROTATION_TYPE.TYPE1:
              return [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: -1, y: 2 }]
            case ROTATION_TYPE.TYPE2:
              return [{ x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }]
            case ROTATION_TYPE.TYPE3:
              return [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }]
            case ROTATION_TYPE.TYPE4:
              return [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }]
          }
        },
        color: colorSet.orange
      }
    }
    this.init = function() {
      initData()
      initEvent()
      // fillOneRect(0,5,colorSet.red);
      start()
    }
    this.set = function(key, val) {
      set[key] = val
    }
    var start = function() {
      gaming = true
      getTeris(set.startX, set.startY)
      reSetView()
      timeController()
    }
    var stop = function() {
      console.log("stop timer", timer)
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    }
    var timeController = function() {
      timer = setTimeout(function() {
        var groupId = getGroupId()
        if (!groupId && gaming) {
          getTeris(set.startX, set.startY)
        }
        if (!gaming) {
          showGameOver()
        }
        reSetView()
        goNextStep()

        if (shouldStop) {
          shouldStop = false
        } else {
          timeController()
        }
      }, set.spaceTime)
      console.log("timeController timer", timer)
    }
    var reSetView = function() {
      drawGridView()
      drawFillCell()
    }
    var drawFillCell = function() {
      console.log("drawFillCell", map)
      Object.keys(map).forEach(function(key) {
        fillOneRect(map[key].x, map[key].y, map[key].color)
      })
    }

    var showGameOver = function() {
      $("#game-over").show()
    }
    var getGroupId = function() {
      var canMoveArray = Object.keys(map).filter(key => map[key].canMove)
      return canMoveArray.length > 0 ? map[canMoveArray[0]].groupId : ""
    }
    var getNextRotation = function(type) {
      switch (type) {
        case ROTATION_TYPE.TYPE1:
          return ROTATION_TYPE.TYPE2
        case ROTATION_TYPE.TYPE2:
          return ROTATION_TYPE.TYPE3
        case ROTATION_TYPE.TYPE3:
          return ROTATION_TYPE.TYPE4
        case ROTATION_TYPE.TYPE4:
          return ROTATION_TYPE.TYPE1
      }
    }
    var goNextStep = function() {
      var groupId = getGroupId()
      var type = moveType.DOWN
      if (!groupId) {
        shouldStop = true
        return
      }
      var valid = canMoveGroup(groupId, type)
      if (valid) {
        moveGroup(groupId, type)
      } else {
        disableGroup(groupId)
        clearFinishLine()
      }
    }
    var disableGroup = function(groupId) {
      Object.keys(map).forEach(key => {
        if (map[key].groupId == groupId) {
          map[key].canMove = false
        }
      })
    }
    var moveGroup = function(groupId, type) {
      var groupArray = Object.keys(map).filter(key => map[key].groupId == groupId)
      groupArray.forEach(el => {
        var position = getNewPostionByType(map[el].x, map[el].y, type)
        var subX = position.x - map[el].x
        var subY = position.y - map[el].y
        map[el].x = position.x
        map[el].y = position.y
        map[el].groupX = map[el].groupX + subX
        map[el].groupY = map[el].groupY + subY
      })
    }

    var canMoveGroup = function(groupId, type) {
      var groupArray = Object.keys(map).filter(key => map[key].groupId == groupId)
      var valid = true
      groupArray.forEach(el => {
        var position = getNewPostionByType(map[el].x, map[el].y, type)

        if (!canMove(position.x, position.y, groupId)) {
          valid = false
        }
      })
      console.log("canMoveGroup " + groupId + " type " + type + " canMove  " + valid)
      return valid
    }
    var canMove = function(x, y, groupId) {
      if (x < 0 || x >= set.grid_cols || y < 0 || y >= set.grid_rows) return false
      return !Object.keys(map).find(key => map[key].x == x && map[key].y == y && map[key].groupId != groupId)
    }
    var canRotation = function(groupId) {
      var groupArray = Object.keys(map).filter(key => map[key].groupId == groupId)
      var x = map[groupArray[0]].groupX
      var y = map[groupArray[0]].groupY
      var rotation = getNextRotation(map[groupArray[0]].rotation)
      var cubeType = map[groupArray[0]].cubeType
      var cubeItem = CUBE_INFO[cubeType]

      if (checkValidCube(x, y, cubeItem.bodyArray(rotation), groupId)) {
        console.log("can Rotation")
        clearGroup(groupId)
        cubeItem.bodyArray(rotation).forEach(obj => {
          addMapCell(x, y, x + obj.x, y + obj.y, groupId, cubeItem.color, cubeType, rotation)
        })
        return true
      } else {
        console.log("can not Rotation")
      }
    }
    var clearGroup = function(groupId) {
      Object.keys(map).forEach(key => {
        if (map[key].groupId == groupId) delete map[key]
      })
    }
    var getNewPostionByType = function(x, y, type) {
      switch (type) {
        case moveType.DOWN:
          y = y + 1
          break
        case moveType.LEFT:
          x = x - 1
          break
        case moveType.RIGHT:
          x = x + 1
          break
      }
      return {
        x,
        y
      }
    }
    var getTeris = function(x, y) {
      var cubeType = "cube" + (Math.floor(Object.keys(CUBE_INFO).length * Math.random()) + 1)
      var cubeItem = CUBE_INFO[cubeType]

      if (!nextCubeItem) {
        nextCubeItem = cubeItem
        nextCubetype = cubeType
        cubeType = "cube" + (Math.floor(Object.keys(CUBE_INFO).length * Math.random()) + 1)
        cubeItem = CUBE_INFO[cubeType]
      }
      var groupId = "group" + new Date().getTime()
      console.warn("cubeItem", nextCubeItem)
      if (checkValidCube(x, y, nextCubeItem.bodyArray(ROTATION_TYPE.TYPE1))) {
        nextCubeItem.bodyArray(ROTATION_TYPE.TYPE1).forEach(obj => {
          addMapCell(x, y, x + obj.x, y + obj.y, groupId, nextCubeItem.color, nextCubetype, ROTATION_TYPE.TYPE1)
        })
        drawPreviewCube(cubeItem)
        nextCubeItem = cubeItem
        nextCubetype = cubeType
      } else {
        gaming = false
      }
    }
    var checkValidCube = function(x, y, array, groupId) {
      var valid = true
      array.forEach(obj => {
        if (!canMove(x + obj.x, y + obj.y, groupId)) valid = false
      })
      return valid
    }

    var addMapCell = function(groupX, groupY, x, y, groupId, color, cubeType, rotation) {
      var newCell = JSON.parse(JSON.stringify(emptyCell))
      var cellId = new Date().getTime() + Math.floor(100 * Math.random())
      while (map[cellId]) {
        cellId = new Date().getTime() + Math.floor(100 * Math.random())
      }
      newCell.x = x
      newCell.y = y
      newCell.groupId = groupId
      newCell.groupX = groupX
      newCell.groupY = groupY
      newCell.color = color
      newCell.cellId = cellId
      newCell.cubeType = cubeType
      newCell.rotation = rotation
      map[cellId] = newCell
    }
    var initData = function() {
      canvas = $(set.canvasSeletor).get(0)
      previewCanvas = $(set.previewCanvasSeletor).get(0)
      cell_height = canvas.height / set.grid_rows
      cell_width = canvas.width / set.grid_cols
    }
    var initEvent = function() {
      $(document).on("keydown", function(e) {
        var groupId = getGroupId()
        console.log("e.keyCode", e.keyCode)
        if (!groupId) return
        if (e.keyCode == 37) {
          //left
          if (canMoveGroup(groupId, moveType.LEFT)) {
            moveGroup(groupId, moveType.LEFT)
            reSetView()
          }
        } else if (e.keyCode == 39) {
          //right
          if (canMoveGroup(groupId, moveType.RIGHT)) {
            moveGroup(groupId, moveType.RIGHT)
            reSetView()
          }
        } else if (e.keyCode == 40) {
          //down
          if (canMoveGroup(groupId, moveType.DOWN)) {
            moveGroup(groupId, moveType.DOWN)
            reSetView()
          }
        } else if (e.keyCode == 38) {
          //up

          if (canRotation(groupId)) {
            reSetView()
          }
        } else if (e.keyCode == 32) {
          //up
          if (timer) {
            shouldStop = true
            stop()
          } else {
            shouldStop = false
            timeController()
          }
        }
      })
      $("#pause").click(function() {
        shouldStop = true
        stop()
      })
      $("#continue").click(function() {
        if (!timer) {
          shouldStop = false
          timeController()
        }
      })
      $("#restart").click(function() {
        $("#game-over").hide()
        stop()
        shouldStop = false
        gaming = true
        map = {}
        score = 0
        timeController()
      })
    }
    var drawGridView = function(c, pcol, prow) {
      var dcanvas = c ? c : canvas
      var cols = pcol ? pcol : set.grid_cols
      var rows = prow ? prow : set.grid_rows
      var ctx = dcanvas.getContext("2d")
      var gradient = ctx.createLinearGradient(0, 0, 0, 300)
      gradient.addColorStop(0, "#e0e0e0")
      gradient.addColorStop(1, "#ffffff")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, dcanvas.width, dcanvas.height)
      ctx.lineWidth = set.lineWidth
      ctx.strokeStyle = set.ctxStrokeStyle
      //   結束邉框描繪
      ctx.beginPath()

      for (var col = 0; col < cols; col++) {
        var x = (col * dcanvas.width) / cols
        ctx.moveTo(x, 0)
        ctx.lineTo(x, dcanvas.height)
      }
      for (var row = 0; row < rows; row++) {
        var y = (row * dcanvas.height) / rows
        ctx.moveTo(0, y)
        ctx.lineTo(dcanvas.width, y)
      }
      ctx.stroke()
    }
    var fillOneRect = function(ox, oy, color, c, pcol, prow) {
      var dcanvas = c ? c : canvas
      var cols = pcol ? pcol : set.grid_cols
      var rows = prow ? prow : set.grid_rows
      var cell_width = dcanvas.width / cols
      var cell_height = dcanvas.height / rows
      var ctx = dcanvas.getContext("2d")
      var rect = getRectPosition(ox, oy, cell_width, cell_height)
      ctx.fillStyle = color
      ctx.fillRect(rect.ox, rect.oy, cell_width, cell_height)
    }
    var drawPreviewCube = function(cubeItem) {
      console.warn("drawPreviewCube", cubeItem)
      drawGridView(previewCanvas, 4, 4)
      cubeItem.bodyArray(ROTATION_TYPE.TYPE1).forEach(obj => {
        fillOneRect(obj.x + 1, obj.y, cubeItem.color, previewCanvas, 4, 4)
      })
    }

    var getRectPosition = function(x, y, cell_width, cell_height) {
      var ox = x * cell_width
      var oy = y * cell_height
      var RightBottomX = (x + 1) * cell_width
      var RightBottomY = (y + 1) * cell_height
      return {
        ox: ox,
        oy: oy,
        RightBottomX: RightBottomX,
        RightBottomy: RightBottomY
      }
    }
    var clearFinishLine = function() {
      var line = {}
      Object.keys(map).forEach(function(key) {
        if (!map[key].canMove) {
          if (line[map[key].y]) {
            line[map[key].y].push(map[key].x)
          } else {
            line[map[key].y] = []
            line[map[key].y].push(map[key].x)
          }
        }
      })
      Object.keys(line).forEach(l => {
        if (line[l].length == set.grid_cols) {
          console.warn("line full!!!!!!!!", l)
          clearLine(l)
          addScore()
          moveDown(l)
        }
      })
    }
    var clearLine = function(y) {
      Object.keys(map).forEach(function(key) {
        if (map[key].y == y) {
          delete map[key]
        }
      })
    }
    var moveDown = function(y) {
      Object.keys(map).forEach(function(key) {
        if (map[key].y < y) {
          map[key].y++
          map[key].groupY++
        }
      })
    }
    var addScore = function() {
      score += 10
      $("#score-number").text(score)
    }
  }
  var pageController = new PageController()
  pageController.init()
})()
