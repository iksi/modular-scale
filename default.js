var modularScale = (function () {
  var ratios = {
    minorSecond: 16 / 15,               // 1.067
    majorSecond: 9 / 8,                 // 1.125
    minorThird: 6 / 5,                  // 1.2
    majorThird: 5 / 4,                  // 1.25
    perfectFourth: 4 / 3,               // 1.333
    augmentedFourth: Math.sqrt(2) / 1,  // 1.414
    perfectFifth: 3 / 2,                // 1.5
    minorSixth: 8 / 5,                  // 1.6
    golden: 1 / 2 + Math.sqrt(5) / 2,   // 1.618
    majorSixth: 5 / 3,                  // 1.667
    minorSeventh: 16 / 9,               // 1.778
    majorSeventh: 15 / 8,               // 1.875
    octave: 2 / 1,                      // 2
    majorTenth: 5 / 2,                  // 2.5
    majorEleventh: 8 / 3,               // 2.667
    majorTwelfth: 3 / 1,                // 3
    doubleOctave: 4 / 1                 // 4
  }

  var defaults = {
    bases: 16,
    bigger: 5,
    ratio: 'majorThird',
    rounding: 'nearest',
    smaller: 2
  }

  function modularScale (options) {
    options = options || {}

    for (var attribute in defaults) {
      if (!options.hasOwnProperty(attribute)) {
        options[attribute] = defaults[attribute]
      }
    }

    // assign variables for easier reading
    var {bases, bigger, ratio, rounding, smaller} = options

    if (typeof ratio === 'string') {
      ratio = ratios[ratio]
    }

    var scale = []
    var pixel
    var base

    for (var step = smaller * -1; step < bigger + 1; step++) {
      if (typeof bases === 'number') {
        pixel = bases * Math.pow(ratio, step)
      } else {
        for (var i = 0; i < bases.length; i++) {
          // lower
          while (bases[i] > bases[0]) {
            bases[i] = bases[i] * Math.pow(ratio, -1)
          }
          // raise
          while (bases[i] < bases[0]) {
            bases[i] = bases[i] * Math.pow(ratio, 1)
          }
        }

        bases.sort()

        // which base to user (with fixed modulo)
        base = bases[(step % bases.length + bases.length) % bases.length]

        pixel = base * Math.pow(ratio, Math.floor(step / bases.length))
      }

      if (rounding === 'down') {
        pixel = Math.floor(pixel)
      } else if (rounding === 'nearest') {
        pixel = Math.round(pixel)
      } else if (rounding === 'up') {
        pixel = Math.ceil(pixel)
      }

      scale.push({
        px: pixel,
        rem: pixel / 16
      })
    }

    return scale
  }

  return modularScale
}())

var options = {
  bases: [17],
  ratio: 'minorSecond',
  smaller: 1,
  bigger: 5,
  rounding: 'down'
}

var scale = modularScale(options)
var fragment = document.createDocumentFragment()

console.table(scale)

for (var i = 0; i < scale.length; i++) {
  var div = document.createElement('div')

  div.textContent = 'Antwerp, Belgium. A city steeped in history. A centre of Dutch and Flemish Renaissance painting. The home of Rubens. Where Raf Simons and Martin Margiela studied. Where the fashion collective known as the Antwerp Six met and merged. For a comparatively small city in northern Europe (its population totals just over half a million people), Antwerp’s impact on the worlds of art and high fashion is colossal.'
  div.style.fontSize = scale[i].rem + 'rem'

  div.setAttribute('data-px', scale[i].px)
  div.setAttribute('data-rem', scale[i].rem)

  fragment.appendChild(div)
}

document.body.appendChild(fragment)
