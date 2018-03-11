var assert = require('assert')

var VERTICAL = '│'
var HORIZONTAL = '─'
var DOWN_RIGHT = '┌'
var DOWN_LEFT = '┐'

module.exports = function (options) {
  assert.equal(typeof options, 'object')

  var data = options.data
  assert(Array.isArray(data))
  assert(data.every(function (commit) {
    return (
      typeof commit === 'object' &&
      commit.hasOwnProperty('id') &&
      typeof commit.id === 'string' &&
      commit.hasOwnProperty('parents') &&
      Array.isArray(commit.parents) &&
      commit.parents.every(function (parent) {
        return typeof parent === 'string'
      })
    )
  }))
  assert(data.every(function (commit, index) {
    return commit.parents.every(function (parent) {
      return data.some(function (otherCommit, otherIndex) {
        return (
          index !== otherIndex &&
          otherCommit.id === parent
        )
      })
    })
  }))

  var comparator = options.comparator
  assert.equal(typeof comparator, 'function')

  var render = options.render
  assert.equal(typeof render, 'function')

  var table = document.createElement('table')

  var sorted = Object.values(data)
    .sort(comparator)
    .reverse()

  var lastColumn = assignColumns(sorted)

  sorted.forEach(function (commit) {
    var column = commit.column

    var dataTR = document.createElement('tr')
    table.appendChild(dataTR)

    // Empty <td>s before Data <td>
    repeat(column, function () {
      dataTR.appendChild(emptyTD())
    })

    // Data <td>
    var td = document.createElement('td')
    dataTR.appendChild(td)
    options.render(td, commit, column)

    // Empty <td>s after Data <td>
    repeat(lastColumn - column, function () {
      dataTR.appendChild(emptyTD())
    })

    var arrowTR = document.createElement('tr')
    table.appendChild(arrowTR)

    repeat(column, function () {
      arrowTR.appendChild(emptyTD())
    })
    if (commit.parents.length === 0) {
      arrowTR.appendChild(emptyTD())
    } else {
      var arrowTD = document.createElement('td')
      arrowTD.className = 'arrow'
      arrowTD.appendChild(document.createTextNode(VERTICAL))
      arrowTR.appendChild(arrowTD)
    }
    repeat(lastColumn - column, function () {
      arrowTR.appendChild(emptyTD())
    })
  })

  return table
}

function assignColumns (data) {
  var lastColumn = -1
  var columns = new Map()
  data.forEach(function (commit) {
    var id = commit.id
    var parents = commit.parents
    if (columns.has(id)) {
      commit.column = columns.get(id)
    } else {
      lastColumn++
      commit.column = lastColumn
      columns.set(id, commit.column)
    }
    if (parents.length !== 0) {
      columns.set(parents[0], commit.column)
    }
  })
  return lastColumn
}

function emptyTD () {
  var td = document.createElement('td')
  td.className = 'empty'
  return td
}

function repeat (times, operation) {
  if (times <= 0) return
  for (var counter = 1; counter <= times; counter++) {
    operation()
  }
}
