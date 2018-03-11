var assert = require('assert')

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

  var columnCounter = -1
  var columns = {}
  sorted.forEach(function (commit) {
    var id = commit.id
    var parents = commit.parents
    if (columns.hasOwnProperty(id)) {
      commit.column = columns[id]
    } else {
      columnCounter++
      commit.column = columnCounter
      columns[id] = commit.column
    }
    if (parents.length !== 0) {
      columns[parents[0]] = commit.column
    }
  })

  sorted.forEach(function (commit) {
    var column = commit.column

    var tr = document.createElement('tr')
    table.appendChild(tr)

    // Empty <td>s before Data <td>
    repeat(column, function () {
      tr.appendChild(emptyTD())
    })

    // Data <td>
    var td = document.createElement('td')
    tr.appendChild(td)
    options.render(td, commit, column)

    // Empty <td>s after Data <td>
    repeat(columnCounter - column, function () {
      tr.appendChild(emptyTD())
    })
  })

  return table
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
