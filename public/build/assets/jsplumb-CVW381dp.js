var jsplumb = {};
var hasRequiredJsplumb;
function requireJsplumb() {
  if (hasRequiredJsplumb) return jsplumb;
  hasRequiredJsplumb = 1;
  (function(exports) {
    (function() {
      if (typeof Math.sgn == "undefined") {
        Math.sgn = function(x) {
          return x == 0 ? 0 : x > 0 ? 1 : -1;
        };
      }
      var Vectors = {
        subtract: function(v1, v2) {
          return { x: v1.x - v2.x, y: v1.y - v2.y };
        },
        dotProduct: function(v1, v2) {
          return v1.x * v2.x + v1.y * v2.y;
        },
        square: function(v) {
          return Math.sqrt(v.x * v.x + v.y * v.y);
        },
        scale: function(v, s) {
          return { x: v.x * s, y: v.y * s };
        }
      }, maxRecursion = 64, flatnessTolerance = Math.pow(2, -maxRecursion - 1);
      var _distanceFromCurve = function(point, curve) {
        var candidates = [], w = _convertToBezier(point, curve), degree = curve.length - 1, higherDegree = 2 * degree - 1, numSolutions = _findRoots(w, higherDegree, candidates, 0), v = Vectors.subtract(point, curve[0]), dist = Vectors.square(v), t = 0;
        for (var i = 0; i < numSolutions; i++) {
          v = Vectors.subtract(point, _bezier(curve, degree, candidates[i], null, null));
          var newDist = Vectors.square(v);
          if (newDist < dist) {
            dist = newDist;
            t = candidates[i];
          }
        }
        v = Vectors.subtract(point, curve[degree]);
        newDist = Vectors.square(v);
        if (newDist < dist) {
          dist = newDist;
          t = 1;
        }
        return { location: t, distance: dist };
      };
      var _nearestPointOnCurve = function(point, curve) {
        var td = _distanceFromCurve(point, curve);
        return { point: _bezier(curve, curve.length - 1, td.location, null, null), location: td.location };
      };
      var _convertToBezier = function(point, curve) {
        var degree = curve.length - 1, higherDegree = 2 * degree - 1, c = [], d = [], cdTable = [], w = [], z = [[1, 0.6, 0.3, 0.1], [0.4, 0.6, 0.6, 0.4], [0.1, 0.3, 0.6, 1]];
        for (var i = 0; i <= degree; i++) c[i] = Vectors.subtract(curve[i], point);
        for (var i = 0; i <= degree - 1; i++) {
          d[i] = Vectors.subtract(curve[i + 1], curve[i]);
          d[i] = Vectors.scale(d[i], 3);
        }
        for (var row = 0; row <= degree - 1; row++) {
          for (var column = 0; column <= degree; column++) {
            if (!cdTable[row]) cdTable[row] = [];
            cdTable[row][column] = Vectors.dotProduct(d[row], c[column]);
          }
        }
        for (i = 0; i <= higherDegree; i++) {
          if (!w[i]) w[i] = [];
          w[i].y = 0;
          w[i].x = parseFloat(i) / higherDegree;
        }
        var n = degree, m = degree - 1;
        for (var k = 0; k <= n + m; k++) {
          var lb = Math.max(0, k - m), ub = Math.min(k, n);
          for (i = lb; i <= ub; i++) {
            var j = k - i;
            w[i + j].y += cdTable[j][i] * z[j][i];
          }
        }
        return w;
      };
      var _findRoots = function(w, degree, t, depth) {
        var left = [], right = [], left_count, right_count, left_t = [], right_t = [];
        switch (_getCrossingCount(w, degree)) {
          case 0: {
            return 0;
          }
          case 1: {
            if (depth >= maxRecursion) {
              t[0] = (w[0].x + w[degree].x) / 2;
              return 1;
            }
            if (_isFlatEnough(w, degree)) {
              t[0] = _computeXIntercept(w, degree);
              return 1;
            }
            break;
          }
        }
        _bezier(w, degree, 0.5, left, right);
        left_count = _findRoots(left, degree, left_t, depth + 1);
        right_count = _findRoots(right, degree, right_t, depth + 1);
        for (var i = 0; i < left_count; i++) t[i] = left_t[i];
        for (var i = 0; i < right_count; i++) t[i + left_count] = right_t[i];
        return left_count + right_count;
      };
      var _getCrossingCount = function(curve, degree) {
        var n_crossings = 0, sign, old_sign;
        sign = old_sign = Math.sgn(curve[0].y);
        for (var i = 1; i <= degree; i++) {
          sign = Math.sgn(curve[i].y);
          if (sign != old_sign) n_crossings++;
          old_sign = sign;
        }
        return n_crossings;
      };
      var _isFlatEnough = function(curve, degree) {
        var error, intercept_1, intercept_2, left_intercept, right_intercept, a, b, c, det, dInv, a1, b1, c1, a2, b2, c2;
        a = curve[0].y - curve[degree].y;
        b = curve[degree].x - curve[0].x;
        c = curve[0].x * curve[degree].y - curve[degree].x * curve[0].y;
        var max_distance_above, max_distance_below;
        max_distance_above = max_distance_below = 0;
        for (var i = 1; i < degree; i++) {
          var value = a * curve[i].x + b * curve[i].y + c;
          if (value > max_distance_above)
            max_distance_above = value;
          else if (value < max_distance_below)
            max_distance_below = value;
        }
        a1 = 0;
        b1 = 1;
        c1 = 0;
        a2 = a;
        b2 = b;
        c2 = c - max_distance_above;
        det = a1 * b2 - a2 * b1;
        dInv = 1 / det;
        intercept_1 = (b1 * c2 - b2 * c1) * dInv;
        a2 = a;
        b2 = b;
        c2 = c - max_distance_below;
        det = a1 * b2 - a2 * b1;
        dInv = 1 / det;
        intercept_2 = (b1 * c2 - b2 * c1) * dInv;
        left_intercept = Math.min(intercept_1, intercept_2);
        right_intercept = Math.max(intercept_1, intercept_2);
        error = right_intercept - left_intercept;
        return error < flatnessTolerance ? 1 : 0;
      };
      var _computeXIntercept = function(curve, degree) {
        var XLK = 1, YLK = 0, XNM = curve[degree].x - curve[0].x, YNM = curve[degree].y - curve[0].y, XMK = curve[0].x - 0, YMK = curve[0].y - 0, det = XNM * YLK - YNM * XLK, detInv = 1 / det, S = (XNM * YMK - YNM * XMK) * detInv;
        return 0 + XLK * S;
      };
      var _bezier = function(curve, degree, t, left, right) {
        var temp = [[]];
        for (var j = 0; j <= degree; j++) temp[0][j] = curve[j];
        for (var i = 1; i <= degree; i++) {
          for (var j = 0; j <= degree - i; j++) {
            if (!temp[i]) temp[i] = [];
            if (!temp[i][j]) temp[i][j] = {};
            temp[i][j].x = (1 - t) * temp[i - 1][j].x + t * temp[i - 1][j + 1].x;
            temp[i][j].y = (1 - t) * temp[i - 1][j].y + t * temp[i - 1][j + 1].y;
          }
        }
        if (left != null)
          for (j = 0; j <= degree; j++) left[j] = temp[j][0];
        if (right != null)
          for (j = 0; j <= degree; j++) right[j] = temp[degree - j][j];
        return temp[degree][0];
      };
      var _curveFunctionCache = {};
      var _getCurveFunctions = function(order) {
        var fns = _curveFunctionCache[order];
        if (!fns) {
          fns = [];
          var f_term = function() {
            return function(t) {
              return Math.pow(t, order);
            };
          }, l_term = function() {
            return function(t) {
              return Math.pow(1 - t, order);
            };
          }, c_term = function(c) {
            return function(t) {
              return c;
            };
          }, t_term = function() {
            return function(t) {
              return t;
            };
          }, one_minus_t_term = function() {
            return function(t) {
              return 1 - t;
            };
          }, _termFunc = function(terms2) {
            return function(t) {
              var p = 1;
              for (var i2 = 0; i2 < terms2.length; i2++) p = p * terms2[i2](t);
              return p;
            };
          };
          fns.push(new f_term());
          for (var i = 1; i < order; i++) {
            var terms = [new c_term(order)];
            for (var j = 0; j < order - i; j++) terms.push(new t_term());
            for (var j = 0; j < i; j++) terms.push(new one_minus_t_term());
            fns.push(new _termFunc(terms));
          }
          fns.push(new l_term());
          _curveFunctionCache[order] = fns;
        }
        return fns;
      };
      var _pointOnPath = function(curve, location) {
        var cc = _getCurveFunctions(curve.length - 1), _x = 0, _y = 0;
        for (var i = 0; i < curve.length; i++) {
          _x = _x + curve[i].x * cc[i](location);
          _y = _y + curve[i].y * cc[i](location);
        }
        return { x: _x, y: _y };
      };
      var _dist = function(p1, p2) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
      };
      var _isPoint = function(curve) {
        return curve[0].x === curve[1].x && curve[0].y === curve[1].y;
      };
      var _pointAlongPath = function(curve, location, distance) {
        if (_isPoint(curve)) {
          return {
            point: curve[0],
            location
          };
        }
        var prev = _pointOnPath(curve, location), tally = 0, curLoc = location, direction = distance > 0 ? 1 : -1, cur = null;
        while (tally < Math.abs(distance)) {
          curLoc += 5e-3 * direction;
          cur = _pointOnPath(curve, curLoc);
          tally += _dist(cur, prev);
          prev = cur;
        }
        return { point: cur, location: curLoc };
      };
      var _length = function(curve) {
        var d = (/* @__PURE__ */ new Date()).getTime();
        if (_isPoint(curve)) return 0;
        var prev = _pointOnPath(curve, 0), tally = 0, curLoc = 0, direction = 1, cur = null;
        while (curLoc < 1) {
          curLoc += 5e-3 * direction;
          cur = _pointOnPath(curve, curLoc);
          tally += _dist(cur, prev);
          prev = cur;
        }
        console.log("length", (/* @__PURE__ */ new Date()).getTime() - d);
        return tally;
      };
      var _pointAlongPathFrom = function(curve, location, distance) {
        return _pointAlongPath(curve, location, distance).point;
      };
      var _locationAlongPathFrom = function(curve, location, distance) {
        return _pointAlongPath(curve, location, distance).location;
      };
      var _gradientAtPoint = function(curve, location) {
        var p1 = _pointOnPath(curve, location), p2 = _pointOnPath(curve.slice(0, curve.length - 1), location), dy = p2.y - p1.y, dx = p2.x - p1.x;
        return dy === 0 ? Infinity : Math.atan(dy / dx);
      };
      var _gradientAtPointAlongPathFrom = function(curve, location, distance) {
        var p = _pointAlongPath(curve, location, distance);
        if (p.location > 1) p.location = 1;
        if (p.location < 0) p.location = 0;
        return _gradientAtPoint(curve, p.location);
      };
      var _perpendicularToPathAt = function(curve, location, length, distance) {
        distance = distance == null ? 0 : distance;
        var p = _pointAlongPath(curve, location, distance), m = _gradientAtPoint(curve, p.location), _theta2 = Math.atan(-1 / m), y = length / 2 * Math.sin(_theta2), x = length / 2 * Math.cos(_theta2);
        return [{ x: p.point.x + x, y: p.point.y + y }, { x: p.point.x - x, y: p.point.y - y }];
      };
      var _lineIntersection = function(x1, y1, x2, y2, curve) {
        var a = y2 - y1, b = x1 - x2, c = x1 * (y1 - y2) + y1 * (x2 - x1), coeffs = _computeCoefficients(curve), p = [
          a * coeffs[0][0] + b * coeffs[1][0],
          a * coeffs[0][1] + b * coeffs[1][1],
          a * coeffs[0][2] + b * coeffs[1][2],
          a * coeffs[0][3] + b * coeffs[1][3] + c
        ], r = _cubicRoots.apply(null, p), intersections = [];
        if (r != null) {
          for (var i = 0; i < 3; i++) {
            var t = r[i], t2 = Math.pow(t, 2), t3 = Math.pow(t, 3), x = [
              coeffs[0][0] * t3 + coeffs[0][1] * t2 + coeffs[0][2] * t + coeffs[0][3],
              coeffs[1][0] * t3 + coeffs[1][1] * t2 + coeffs[1][2] * t + coeffs[1][3]
            ];
            var s;
            if (x2 - x1 !== 0) {
              s = (x[0] - x1) / (x2 - x1);
            } else {
              s = (x[1] - y1) / (y2 - y1);
            }
            if (t >= 0 && t <= 1 && s >= 0 && s <= 1) {
              intersections.push(x);
            }
          }
        }
        return intersections;
      };
      var _boxIntersection = function(x, y, w, h, curve) {
        var i = [];
        i.push.apply(i, _lineIntersection(x, y, x + w, y, curve));
        i.push.apply(i, _lineIntersection(x + w, y, x + w, y + h, curve));
        i.push.apply(i, _lineIntersection(x + w, y + h, x, y + h, curve));
        i.push.apply(i, _lineIntersection(x, y + h, x, y, curve));
        return i;
      };
      var _boundingBoxIntersection = function(boundingBox, curve) {
        var i = [];
        i.push.apply(i, _lineIntersection(boundingBox.x, boundingBox.y, boundingBox.x + boundingBox.w, boundingBox.y, curve));
        i.push.apply(i, _lineIntersection(boundingBox.x + boundingBox.w, boundingBox.y, boundingBox.x + boundingBox.w, boundingBox.y + boundingBox.h, curve));
        i.push.apply(i, _lineIntersection(boundingBox.x + boundingBox.w, boundingBox.y + boundingBox.h, boundingBox.x, boundingBox.y + boundingBox.h, curve));
        i.push.apply(i, _lineIntersection(boundingBox.x, boundingBox.y + boundingBox.h, boundingBox.x, boundingBox.y, curve));
        return i;
      };
      function _computeCoefficientsForAxis(curve, axis) {
        return [
          -curve[0][axis] + 3 * curve[1][axis] + -3 * curve[2][axis] + curve[3][axis],
          3 * curve[0][axis] - 6 * curve[1][axis] + 3 * curve[2][axis],
          -3 * curve[0][axis] + 3 * curve[1][axis],
          curve[0][axis]
        ];
      }
      function _computeCoefficients(curve) {
        return [
          _computeCoefficientsForAxis(curve, "x"),
          _computeCoefficientsForAxis(curve, "y")
        ];
      }
      function sgn(x) {
        return x < 0 ? -1 : x > 0 ? 1 : 0;
      }
      function _cubicRoots(a, b, c, d) {
        var A = b / a, B = c / a, C = d / a, Q = (3 * B - Math.pow(A, 2)) / 9, R = (9 * A * B - 27 * C - 2 * Math.pow(A, 3)) / 54, D = Math.pow(Q, 3) + Math.pow(R, 2), S, T, t = [];
        if (D >= 0) {
          S = sgn(R + Math.sqrt(D)) * Math.pow(Math.abs(R + Math.sqrt(D)), 1 / 3);
          T = sgn(R - Math.sqrt(D)) * Math.pow(Math.abs(R - Math.sqrt(D)), 1 / 3);
          t[0] = -A / 3 + (S + T);
          t[1] = -A / 3 - (S + T) / 2;
          t[2] = -A / 3 - (S + T) / 2;
          if (Math.abs(Math.sqrt(3) * (S - T) / 2) !== 0) {
            t[1] = -1;
            t[2] = -1;
          }
        } else {
          var th = Math.acos(R / Math.sqrt(-Math.pow(Q, 3)));
          t[0] = 2 * Math.sqrt(-Q) * Math.cos(th / 3) - A / 3;
          t[1] = 2 * Math.sqrt(-Q) * Math.cos((th + 2 * Math.PI) / 3) - A / 3;
          t[2] = 2 * Math.sqrt(-Q) * Math.cos((th + 4 * Math.PI) / 3) - A / 3;
        }
        for (var i = 0; i < 3; i++) {
          if (t[i] < 0 || t[i] > 1) {
            t[i] = -1;
          }
        }
        return t;
      }
      var jsBezier = this.jsBezier = {
        distanceFromCurve: _distanceFromCurve,
        gradientAtPoint: _gradientAtPoint,
        gradientAtPointAlongCurveFrom: _gradientAtPointAlongPathFrom,
        nearestPointOnCurve: _nearestPointOnCurve,
        pointOnCurve: _pointOnPath,
        pointAlongCurveFrom: _pointAlongPathFrom,
        perpendicularToCurveAt: _perpendicularToPathAt,
        locationAlongCurveFrom: _locationAlongPathFrom,
        getLength: _length,
        lineIntersection: _lineIntersection,
        boxIntersection: _boxIntersection,
        boundingBoxIntersection: _boundingBoxIntersection,
        version: "0.9.0"
      };
      {
        exports.jsBezier = jsBezier;
      }
    }).call(typeof window !== "undefined" ? window : jsplumb);
    (function() {
      var root = this;
      var Biltong2 = root.Biltong = {
        version: "0.4.0"
      };
      {
        exports.Biltong = Biltong2;
      }
      var _isa = function(a) {
        return Object.prototype.toString.call(a) === "[object Array]";
      }, _pointHelper = function(p1, p2, fn) {
        p1 = _isa(p1) ? p1 : [p1.x, p1.y];
        p2 = _isa(p2) ? p2 : [p2.x, p2.y];
        return fn(p1, p2);
      }, _gradient = Biltong2.gradient = function(p1, p2) {
        return _pointHelper(p1, p2, function(_p1, _p2) {
          if (_p2[0] == _p1[0])
            return _p2[1] > _p1[1] ? Infinity : -Infinity;
          else if (_p2[1] == _p1[1])
            return _p2[0] > _p1[0] ? 0 : -0;
          else
            return (_p2[1] - _p1[1]) / (_p2[0] - _p1[0]);
        });
      };
      Biltong2.normal = function(p1, p2) {
        return -1 / _gradient(p1, p2);
      };
      Biltong2.lineLength = function(p1, p2) {
        return _pointHelper(p1, p2, function(_p1, _p2) {
          return Math.sqrt(Math.pow(_p2[1] - _p1[1], 2) + Math.pow(_p2[0] - _p1[0], 2));
        });
      };
      var _quadrant = Biltong2.quadrant = function(p1, p2) {
        return _pointHelper(p1, p2, function(_p1, _p2) {
          if (_p2[0] > _p1[0]) {
            return _p2[1] > _p1[1] ? 2 : 1;
          } else if (_p2[0] == _p1[0]) {
            return _p2[1] > _p1[1] ? 2 : 1;
          } else {
            return _p2[1] > _p1[1] ? 3 : 4;
          }
        });
      };
      Biltong2.theta = function(p1, p2) {
        return _pointHelper(p1, p2, function(_p1, _p2) {
          var m = _gradient(_p1, _p2), t = Math.atan(m), s = _quadrant(_p1, _p2);
          if (s == 4 || s == 3) t += Math.PI;
          if (t < 0) t += 2 * Math.PI;
          return t;
        });
      };
      Biltong2.intersects = function(r1, r2) {
        var x1 = r1.x, x2 = r1.x + r1.w, y1 = r1.y, y2 = r1.y + r1.h, a1 = r2.x, a2 = r2.x + r2.w, b1 = r2.y, b2 = r2.y + r2.h;
        return x1 <= a1 && a1 <= x2 && (y1 <= b1 && b1 <= y2) || x1 <= a2 && a2 <= x2 && (y1 <= b1 && b1 <= y2) || x1 <= a1 && a1 <= x2 && (y1 <= b2 && b2 <= y2) || x1 <= a2 && a1 <= x2 && (y1 <= b2 && b2 <= y2) || a1 <= x1 && x1 <= a2 && (b1 <= y1 && y1 <= b2) || a1 <= x2 && x2 <= a2 && (b1 <= y1 && y1 <= b2) || a1 <= x1 && x1 <= a2 && (b1 <= y2 && y2 <= b2) || a1 <= x2 && x1 <= a2 && (b1 <= y2 && y2 <= b2);
      };
      Biltong2.encloses = function(r1, r2, allowSharedEdges) {
        var x1 = r1.x, x2 = r1.x + r1.w, y1 = r1.y, y2 = r1.y + r1.h, a1 = r2.x, a2 = r2.x + r2.w, b1 = r2.y, b2 = r2.y + r2.h, c = function(v1, v2, v3, v4) {
          return allowSharedEdges ? v1 <= v2 && v3 >= v4 : v1 < v2 && v3 > v4;
        };
        return c(x1, a1, x2, a2) && c(y1, b1, y2, b2);
      };
      var _segmentMultipliers = [null, [1, -1], [1, 1], [-1, 1], [-1, -1]], _inverseSegmentMultipliers = [null, [-1, -1], [-1, 1], [1, 1], [1, -1]];
      Biltong2.pointOnLine = function(fromPoint, toPoint, distance) {
        var m = _gradient(fromPoint, toPoint), s = _quadrant(fromPoint, toPoint), segmentMultiplier = distance > 0 ? _segmentMultipliers[s] : _inverseSegmentMultipliers[s], theta = Math.atan(m), y = Math.abs(distance * Math.sin(theta)) * segmentMultiplier[1], x = Math.abs(distance * Math.cos(theta)) * segmentMultiplier[0];
        return { x: fromPoint.x + x, y: fromPoint.y + y };
      };
      Biltong2.perpendicularLineTo = function(fromPoint, toPoint, length) {
        var m = _gradient(fromPoint, toPoint), theta2 = Math.atan(-1 / m), y = length / 2 * Math.sin(theta2), x = length / 2 * Math.cos(theta2);
        return [{ x: toPoint.x + x, y: toPoint.y + y }, { x: toPoint.x - x, y: toPoint.y - y }];
      };
    }).call(typeof window !== "undefined" ? window : jsplumb);
    (function() {
      function _touch(view, target, pageX, pageY, screenX, screenY, clientX, clientY) {
        return new Touch({
          target,
          identifier: _uuid(),
          pageX,
          pageY,
          screenX,
          screenY,
          clientX: clientX || screenX,
          clientY: clientY || screenY
        });
      }
      function _touchList() {
        var list = [];
        Array.prototype.push.apply(list, arguments);
        list.item = function(index) {
          return this[index];
        };
        return list;
      }
      function _touchAndList(view, target, pageX, pageY, screenX, screenY, clientX, clientY) {
        return _touchList(_touch.apply(null, arguments));
      }
      var root = this, matchesSelector = function(el, selector, ctx) {
        ctx = ctx || el.parentNode;
        var possibles = ctx.querySelectorAll(selector);
        for (var i = 0; i < possibles.length; i++) {
          if (possibles[i] === el) {
            return true;
          }
        }
        return false;
      }, _gel = function(el) {
        return typeof el == "string" || el.constructor === String ? document.getElementById(el) : el;
      }, _t = function(e) {
        return e.srcElement || e.target;
      }, _pi = function(e, target, obj, doCompute) {
        if (!doCompute) return { path: [target], end: 1 };
        else if (typeof e.path !== "undefined" && e.path.indexOf) {
          return { path: e.path, end: e.path.indexOf(obj) };
        } else {
          var out = { path: [], end: -1 }, _one = function(el) {
            out.path.push(el);
            if (el === obj) {
              out.end = out.path.length - 1;
            } else if (el.parentNode != null) {
              _one(el.parentNode);
            }
          };
          _one(target);
          return out;
        }
      }, _d = function(l, fn) {
        for (var i = 0, j = l.length; i < j; i++) {
          if (l[i] == fn) break;
        }
        if (i < l.length) l.splice(i, 1);
      }, guid = 1, _store = function(obj, event, fn) {
        var g = guid++;
        obj.__ta = obj.__ta || {};
        obj.__ta[event] = obj.__ta[event] || {};
        obj.__ta[event][g] = fn;
        fn.__tauid = g;
        return g;
      }, _unstore = function(obj, event, fn) {
        obj.__ta && obj.__ta[event] && delete obj.__ta[event][fn.__tauid];
        if (fn.__taExtra) {
          for (var i = 0; i < fn.__taExtra.length; i++) {
            _unbind(obj, fn.__taExtra[i][0], fn.__taExtra[i][1]);
          }
          fn.__taExtra.length = 0;
        }
        fn.__taUnstore && fn.__taUnstore();
      }, _curryChildFilter = function(children, obj, fn, evt) {
        if (children == null) return fn;
        else {
          var c = children.split(","), _fn = function(e) {
            _fn.__tauid = fn.__tauid;
            var t = _t(e), target = t;
            var pathInfo = _pi(e, t, obj, children != null);
            if (pathInfo.end != -1) {
              for (var p = 0; p < pathInfo.end; p++) {
                target = pathInfo.path[p];
                for (var i = 0; i < c.length; i++) {
                  if (matchesSelector(target, c[i], obj)) {
                    fn.apply(target, arguments);
                  }
                }
              }
            }
          };
          registerExtraFunction(fn, evt, _fn);
          return _fn;
        }
      }, registerExtraFunction = function(fn, evt, newFn) {
        fn.__taExtra = fn.__taExtra || [];
        fn.__taExtra.push([evt, newFn]);
      }, DefaultHandler = function(obj, evt, fn, children) {
        if (isTouchDevice && touchMap[evt]) {
          var tfn = _curryChildFilter(children, obj, fn, touchMap[evt]);
          _bind(obj, touchMap[evt], tfn, fn);
        }
        if (evt === "focus" && obj.getAttribute("tabindex") == null) {
          obj.setAttribute("tabindex", "1");
        }
        _bind(obj, evt, _curryChildFilter(children, obj, fn, evt), fn);
      }, SmartClickHandler = function(obj, evt, fn, children) {
        if (obj.__taSmartClicks == null) {
          var down = function(e) {
            obj.__tad = _pageLocation(e);
          }, up = function(e) {
            obj.__tau = _pageLocation(e);
          }, click = function(e) {
            if (obj.__tad && obj.__tau && obj.__tad[0] === obj.__tau[0] && obj.__tad[1] === obj.__tau[1]) {
              for (var i = 0; i < obj.__taSmartClicks.length; i++)
                obj.__taSmartClicks[i].apply(_t(e), [e]);
            }
          };
          DefaultHandler(obj, "mousedown", down, children);
          DefaultHandler(obj, "mouseup", up, children);
          DefaultHandler(obj, "click", click, children);
          obj.__taSmartClicks = [];
        }
        obj.__taSmartClicks.push(fn);
        fn.__taUnstore = function() {
          _d(obj.__taSmartClicks, fn);
        };
      }, _tapProfiles = {
        "tap": { touches: 1, taps: 1 },
        "dbltap": { touches: 1, taps: 2 },
        "contextmenu": { touches: 2, taps: 1 }
      }, TapHandler = function(clickThreshold, dblClickThreshold) {
        return function(obj, evt, fn, children) {
          if (evt == "contextmenu" && isMouseDevice)
            DefaultHandler(obj, evt, fn, children);
          else {
            if (obj.__taTapHandler == null) {
              var tt = obj.__taTapHandler = {
                tap: [],
                dbltap: [],
                contextmenu: [],
                down: false,
                taps: 0,
                downSelectors: []
              };
              var down = function(e) {
                var target = _t(e), pathInfo = _pi(e, target, obj, children != null), finished = false;
                for (var p = 0; p < pathInfo.end; p++) {
                  if (finished) return;
                  target = pathInfo.path[p];
                  for (var i = 0; i < tt.downSelectors.length; i++) {
                    if (tt.downSelectors[i] == null || matchesSelector(target, tt.downSelectors[i], obj)) {
                      tt.down = true;
                      setTimeout(clearSingle, clickThreshold);
                      setTimeout(clearDouble, dblClickThreshold);
                      finished = true;
                      break;
                    }
                  }
                }
              }, up = function(e) {
                if (tt.down) {
                  var target = _t(e), currentTarget, pathInfo;
                  tt.taps++;
                  var tc = _touchCount(e);
                  for (var eventId in _tapProfiles) {
                    if (_tapProfiles.hasOwnProperty(eventId)) {
                      var p = _tapProfiles[eventId];
                      if (p.touches === tc && (p.taps === 1 || p.taps === tt.taps)) {
                        for (var i = 0; i < tt[eventId].length; i++) {
                          pathInfo = _pi(e, target, obj, tt[eventId][i][1] != null);
                          for (var pLoop = 0; pLoop < pathInfo.end; pLoop++) {
                            currentTarget = pathInfo.path[pLoop];
                            if (tt[eventId][i][1] == null || matchesSelector(currentTarget, tt[eventId][i][1], obj)) {
                              tt[eventId][i][0].apply(currentTarget, [e]);
                              break;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }, clearSingle = function() {
                tt.down = false;
              }, clearDouble = function() {
                tt.taps = 0;
              };
              DefaultHandler(obj, "mousedown", down);
              DefaultHandler(obj, "mouseup", up);
            }
            obj.__taTapHandler.downSelectors.push(children);
            obj.__taTapHandler[evt].push([fn, children]);
            fn.__taUnstore = function() {
              _d(obj.__taTapHandler[evt], fn);
            };
          }
        };
      }, meeHelper = function(type, evt, obj, target) {
        for (var i in obj.__tamee[type]) {
          if (obj.__tamee[type].hasOwnProperty(i)) {
            obj.__tamee[type][i].apply(target, [evt]);
          }
        }
      }, MouseEnterExitHandler = function() {
        var activeElements = [];
        return function(obj, evt, fn, children) {
          if (!obj.__tamee) {
            obj.__tamee = { over: false, mouseenter: [], mouseexit: [] };
            var over = function(e) {
              var t = _t(e);
              if (children == null && (t == obj && !obj.__tamee.over) || matchesSelector(t, children, obj) && (t.__tamee == null || !t.__tamee.over)) {
                meeHelper("mouseenter", e, obj, t);
                t.__tamee = t.__tamee || {};
                t.__tamee.over = true;
                activeElements.push(t);
              }
            }, out = function(e) {
              var t = _t(e);
              for (var i = 0; i < activeElements.length; i++) {
                if (t == activeElements[i] && !matchesSelector(e.relatedTarget || e.toElement, "*", t)) {
                  t.__tamee.over = false;
                  activeElements.splice(i, 1);
                  meeHelper("mouseexit", e, obj, t);
                }
              }
            };
            _bind(obj, "mouseover", _curryChildFilter(children, obj, over, "mouseover"), over);
            _bind(obj, "mouseout", _curryChildFilter(children, obj, out, "mouseout"), out);
          }
          fn.__taUnstore = function() {
            delete obj.__tamee[evt][fn.__tauid];
          };
          _store(obj, evt, fn);
          obj.__tamee[evt][fn.__tauid] = fn;
        };
      }, isTouchDevice = "ontouchstart" in document.documentElement || navigator.maxTouchPoints, isMouseDevice = "onmousedown" in document.documentElement, touchMap = { "mousedown": "touchstart", "mouseup": "touchend", "mousemove": "touchmove" }, iev = function() {
        var rv = -1;
        if (navigator.appName == "Microsoft Internet Explorer") {
          var ua = navigator.userAgent, re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
          if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
        }
        return rv;
      }(), isIELT9 = iev > -1 && iev < 9, _genLoc = function(e, prefix) {
        if (e == null) return [0, 0];
        var ts = _touches(e), t = _getTouch(ts, 0);
        return [t[prefix + "X"], t[prefix + "Y"]];
      }, _pageLocation = function(e) {
        if (e == null) return [0, 0];
        if (isIELT9) {
          return [e.clientX + document.documentElement.scrollLeft, e.clientY + document.documentElement.scrollTop];
        } else {
          return _genLoc(e, "page");
        }
      }, _screenLocation = function(e) {
        return _genLoc(e, "screen");
      }, _clientLocation = function(e) {
        return _genLoc(e, "client");
      }, _getTouch = function(touches, idx) {
        return touches.item ? touches.item(idx) : touches[idx];
      }, _touches = function(e) {
        return e.touches && e.touches.length > 0 ? e.touches : e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches : e.targetTouches && e.targetTouches.length > 0 ? e.targetTouches : [e];
      }, _touchCount = function(e) {
        return _touches(e).length;
      }, _bind = function(obj, type, fn, originalFn) {
        _store(obj, type, fn);
        originalFn.__tauid = fn.__tauid;
        if (obj.addEventListener)
          obj.addEventListener(type, fn, false);
        else if (obj.attachEvent) {
          var key = type + fn.__tauid;
          obj["e" + key] = fn;
          obj[key] = function() {
            obj["e" + key] && obj["e" + key](window.event);
          };
          obj.attachEvent("on" + type, obj[key]);
        }
      }, _unbind = function(obj, type, fn) {
        if (fn == null) return;
        _each(obj, function() {
          var _el = _gel(this);
          _unstore(_el, type, fn);
          if (fn.__tauid != null) {
            if (_el.removeEventListener) {
              _el.removeEventListener(type, fn, false);
              if (isTouchDevice && touchMap[type]) _el.removeEventListener(touchMap[type], fn, false);
            } else if (this.detachEvent) {
              var key = type + fn.__tauid;
              _el[key] && _el.detachEvent("on" + type, _el[key]);
              _el[key] = null;
              _el["e" + key] = null;
            }
          }
          if (fn.__taTouchProxy) {
            _unbind(obj, fn.__taTouchProxy[1], fn.__taTouchProxy[0]);
          }
        });
      }, _each = function(obj, fn) {
        if (obj == null) return;
        obj = typeof Window !== "undefined" && (typeof obj.top !== "unknown" && obj == obj.top) ? [obj] : typeof obj !== "string" && (obj.tagName == null && obj.length != null) ? obj : typeof obj === "string" ? document.querySelectorAll(obj) : [obj];
        for (var i = 0; i < obj.length; i++)
          fn.apply(obj[i]);
      }, _uuid = function() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
          return v.toString(16);
        });
      };
      root.Mottle = function(params) {
        params = params || {};
        var clickThreshold = params.clickThreshold || 250, dblClickThreshold = params.dblClickThreshold || 450, mouseEnterExitHandler = new MouseEnterExitHandler(), tapHandler = new TapHandler(clickThreshold, dblClickThreshold), _smartClicks = params.smartClicks, _doBind = function(obj, evt, fn, children) {
          if (fn == null) return;
          _each(obj, function() {
            var _el = _gel(this);
            if (_smartClicks && evt === "click")
              SmartClickHandler(_el, evt, fn, children);
            else if (evt === "tap" || evt === "dbltap" || evt === "contextmenu") {
              tapHandler(_el, evt, fn, children);
            } else if (evt === "mouseenter" || evt == "mouseexit")
              mouseEnterExitHandler(_el, evt, fn, children);
            else
              DefaultHandler(_el, evt, fn, children);
          });
        };
        this.remove = function(el) {
          _each(el, function() {
            var _el = _gel(this);
            if (_el.__ta) {
              for (var evt in _el.__ta) {
                if (_el.__ta.hasOwnProperty(evt)) {
                  for (var h in _el.__ta[evt]) {
                    if (_el.__ta[evt].hasOwnProperty(h))
                      _unbind(_el, evt, _el.__ta[evt][h]);
                  }
                }
              }
            }
            _el.parentNode && _el.parentNode.removeChild(_el);
          });
          return this;
        };
        this.on = function(el, event, children, fn) {
          var _el = arguments[0], _c = arguments.length == 4 ? arguments[2] : null, _e = arguments[1], _f = arguments[arguments.length - 1];
          _doBind(_el, _e, _f, _c);
          return this;
        };
        this.off = function(el, event, fn) {
          _unbind(el, event, fn);
          return this;
        };
        this.trigger = function(el, event, originalEvent, payload) {
          var originalIsMouse = isMouseDevice && (typeof MouseEvent === "undefined" || originalEvent == null || originalEvent.constructor === MouseEvent);
          var eventToBind = isTouchDevice && !isMouseDevice && touchMap[event] ? touchMap[event] : event, bindingAMouseEvent = !(isTouchDevice && !isMouseDevice && touchMap[event]);
          var pl = _pageLocation(originalEvent), sl = _screenLocation(originalEvent), cl = _clientLocation(originalEvent);
          _each(el, function() {
            var _el = _gel(this), evt;
            originalEvent = originalEvent || {
              screenX: sl[0],
              screenY: sl[1],
              clientX: cl[0],
              clientY: cl[1]
            };
            var _decorate = function(_evt) {
              if (payload) _evt.payload = payload;
            };
            var eventGenerators = {
              "TouchEvent": function(evt2) {
                var touchList = _touchAndList(window, _el, 0, pl[0], pl[1], sl[0], sl[1], cl[0], cl[1]), init = evt2.initTouchEvent || evt2.initEvent;
                init(
                  eventToBind,
                  true,
                  true,
                  window,
                  null,
                  sl[0],
                  sl[1],
                  cl[0],
                  cl[1],
                  false,
                  false,
                  false,
                  false,
                  touchList,
                  touchList,
                  touchList,
                  1,
                  0
                );
              },
              "MouseEvents": function(evt2) {
                evt2.initMouseEvent(
                  eventToBind,
                  true,
                  true,
                  window,
                  0,
                  sl[0],
                  sl[1],
                  cl[0],
                  cl[1],
                  false,
                  false,
                  false,
                  false,
                  1,
                  _el
                );
              }
            };
            if (document.createEvent) {
              var ite = !bindingAMouseEvent && !originalIsMouse && (isTouchDevice && touchMap[event]), evtName = ite ? "TouchEvent" : "MouseEvents";
              evt = document.createEvent(evtName);
              eventGenerators[evtName](evt);
              _decorate(evt);
              _el.dispatchEvent(evt);
            } else if (document.createEventObject) {
              evt = document.createEventObject();
              evt.eventType = evt.eventName = eventToBind;
              evt.screenX = sl[0];
              evt.screenY = sl[1];
              evt.clientX = cl[0];
              evt.clientY = cl[1];
              _decorate(evt);
              _el.fireEvent("on" + eventToBind, evt);
            }
          });
          return this;
        };
      };
      root.Mottle.consume = function(e, doNotPreventDefault) {
        if (e.stopPropagation)
          e.stopPropagation();
        else
          e.returnValue = false;
        if (!doNotPreventDefault && e.preventDefault)
          e.preventDefault();
      };
      root.Mottle.pageLocation = _pageLocation;
      root.Mottle.setForceTouchEvents = function(value) {
        isTouchDevice = value;
      };
      root.Mottle.setForceMouseEvents = function(value) {
        isMouseDevice = value;
      };
      root.Mottle.version = "0.8.0";
      {
        exports.Mottle = root.Mottle;
      }
    }).call(typeof window === "undefined" ? jsplumb : window);
    (function() {
      var root = this;
      var _suggest = function(list, item, head) {
        if (list.indexOf(item) === -1) {
          list.push(item);
          return true;
        }
        return false;
      };
      var _vanquish = function(list, item) {
        var idx = list.indexOf(item);
        if (idx !== -1) list.splice(idx, 1);
      };
      var _difference = function(l1, l2) {
        var d = [];
        for (var i = 0; i < l1.length; i++) {
          if (l2.indexOf(l1[i]) === -1)
            d.push(l1[i]);
        }
        return d;
      };
      var _isString = function(f) {
        return f == null ? false : typeof f === "string" || f.constructor === String;
      };
      var getOffsetRect = function(elem) {
        var box = elem.getBoundingClientRect(), body = document.body, docElem = document.documentElement, scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop, scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft, clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0, top = box.top + scrollTop - clientTop, left = box.left + scrollLeft - clientLeft;
        return { top: Math.round(top), left: Math.round(left) };
      };
      var matchesSelector = function(el, selector, ctx) {
        ctx = ctx || el.parentNode;
        var possibles = ctx.querySelectorAll(selector);
        for (var i = 0; i < possibles.length; i++) {
          if (possibles[i] === el)
            return true;
        }
        return false;
      };
      var findDelegateElement = function(parentElement, childElement, selector) {
        if (matchesSelector(childElement, selector, parentElement)) {
          return childElement;
        } else {
          var currentParent = childElement.parentNode;
          while (currentParent != null && currentParent !== parentElement) {
            if (matchesSelector(currentParent, selector, parentElement)) {
              return currentParent;
            } else {
              currentParent = currentParent.parentNode;
            }
          }
        }
      };
      var findMatchingSelector = function(availableSelectors, parentElement, childElement) {
        var el = null;
        var draggableId = parentElement.getAttribute("katavorio-draggable"), prefix = draggableId != null ? "[katavorio-draggable='" + draggableId + "'] " : "";
        for (var i = 0; i < availableSelectors.length; i++) {
          el = findDelegateElement(parentElement, childElement, prefix + availableSelectors[i].selector);
          if (el != null) {
            if (availableSelectors[i].filter) {
              var matches = matchesSelector(childElement, availableSelectors[i].filter, el), exclude = availableSelectors[i].filterExclude === true;
              if (exclude && !matches || matches) {
                return null;
              }
            }
            return [availableSelectors[i], el];
          }
        }
        return null;
      };
      var iev = function() {
        var rv = -1;
        if (navigator.appName === "Microsoft Internet Explorer") {
          var ua = navigator.userAgent, re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
          if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
        }
        return rv;
      }(), DEFAULT_GRID_X = 10, DEFAULT_GRID_Y = 10, isIELT9 = iev > -1 && iev < 9, isIE9 = iev === 9, _pl = function(e) {
        if (isIELT9) {
          return [e.clientX + document.documentElement.scrollLeft, e.clientY + document.documentElement.scrollTop];
        } else {
          var ts = _touches(e), t = _getTouch(ts, 0);
          return isIE9 ? [t.pageX || t.clientX, t.pageY || t.clientY] : [t.pageX, t.pageY];
        }
      }, _getTouch = function(touches, idx) {
        return touches.item ? touches.item(idx) : touches[idx];
      }, _touches = function(e) {
        return e.touches && e.touches.length > 0 ? e.touches : e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches : e.targetTouches && e.targetTouches.length > 0 ? e.targetTouches : [e];
      }, _classes = {
        delegatedDraggable: "katavorio-delegated-draggable",
        // elements that are the delegated drag handler for a bunch of other elements
        draggable: "katavorio-draggable",
        // draggable elements
        droppable: "katavorio-droppable",
        // droppable elements
        drag: "katavorio-drag",
        // elements currently being dragged
        selected: "katavorio-drag-selected",
        // elements in current drag selection
        active: "katavorio-drag-active",
        // droppables that are targets of a currently dragged element
        hover: "katavorio-drag-hover",
        // droppables over which a matching drag element is hovering
        noSelect: "katavorio-drag-no-select",
        // added to the body to provide a hook to suppress text selection
        ghostProxy: "katavorio-ghost-proxy",
        // added to a ghost proxy element in use when a drag has exited the bounds of its parent.
        clonedDrag: "katavorio-clone-drag"
        // added to a node that is a clone of an element created at the start of a drag
      }, _defaultScope = "katavorio-drag-scope", _events = ["stop", "start", "drag", "drop", "over", "out", "beforeStart"], _devNull = function() {
      }, _true = function() {
        return true;
      }, _foreach = function(l, fn, from) {
        for (var i = 0; i < l.length; i++) {
          if (l[i] != from)
            fn(l[i]);
        }
      }, _setDroppablesActive = function(dd, val, andHover, drag) {
        _foreach(dd, function(e) {
          e.setActive(val);
          if (val) e.updatePosition();
          if (andHover) e.setHover(drag, val);
        });
      }, _each = function(obj, fn) {
        if (obj == null) return;
        obj = !_isString(obj) && (obj.tagName == null && obj.length != null) ? obj : [obj];
        for (var i = 0; i < obj.length; i++)
          fn.apply(obj[i], [obj[i]]);
      }, _consume = function(e) {
        if (e.stopPropagation) {
          e.stopPropagation();
          e.preventDefault();
        } else {
          e.returnValue = false;
        }
      }, _defaultInputFilterSelector = "input,textarea,select,button,option", _inputFilter = function(e, el, _katavorio) {
        var t = e.srcElement || e.target;
        return !matchesSelector(t, _katavorio.getInputFilterSelector(), el);
      };
      var Super = function(el, params, css, scope) {
        this.params = params || {};
        this.el = el;
        this.params.addClass(this.el, this._class);
        this.uuid = _uuid();
        var enabled = true;
        this.setEnabled = function(e) {
          enabled = e;
        };
        this.isEnabled = function() {
          return enabled;
        };
        this.toggleEnabled = function() {
          enabled = !enabled;
        };
        this.setScope = function(scopes) {
          this.scopes = scopes ? scopes.split(/\s+/) : [scope];
        };
        this.addScope = function(scopes) {
          var m = {};
          _each(this.scopes, function(s) {
            m[s] = true;
          });
          _each(scopes ? scopes.split(/\s+/) : [], function(s) {
            m[s] = true;
          });
          this.scopes = [];
          for (var i in m) this.scopes.push(i);
        };
        this.removeScope = function(scopes) {
          var m = {};
          _each(this.scopes, function(s) {
            m[s] = true;
          });
          _each(scopes ? scopes.split(/\s+/) : [], function(s) {
            delete m[s];
          });
          this.scopes = [];
          for (var i in m) this.scopes.push(i);
        };
        this.toggleScope = function(scopes) {
          var m = {};
          _each(this.scopes, function(s) {
            m[s] = true;
          });
          _each(scopes ? scopes.split(/\s+/) : [], function(s) {
            if (m[s]) delete m[s];
            else m[s] = true;
          });
          this.scopes = [];
          for (var i in m) this.scopes.push(i);
        };
        this.setScope(params.scope);
        this.k = params.katavorio;
        return params.katavorio;
      };
      var TRUE = function() {
        return true;
      };
      var FALSE = function() {
        return false;
      };
      var Drag = function(el, params, css, scope) {
        this._class = css.draggable;
        var k = Super.apply(this, arguments);
        this.rightButtonCanDrag = this.params.rightButtonCanDrag;
        var downAt = [0, 0], posAtDown = null, pagePosAtDown = null, pageDelta = [0, 0], moving = false, initialScroll = [0, 0], consumeStartEvent = this.params.consumeStartEvent !== false, dragEl = this.el, clone = this.params.clone;
        this.params.scroll;
        var _multipleDrop = params.multipleDrop !== false, isConstrained = false, useGhostProxy, ghostProxy, elementToDrag = null, availableSelectors = [], activeSelectorParams = null, ghostProxyParent = params.ghostProxyParent, currentParentPosition, ghostParentPosition, ghostDx, ghostDy;
        if (params.ghostProxy === true) {
          useGhostProxy = TRUE;
        } else {
          if (params.ghostProxy && typeof params.ghostProxy === "function") {
            useGhostProxy = params.ghostProxy;
          } else {
            useGhostProxy = function(container, dragEl2) {
              if (activeSelectorParams && activeSelectorParams.useGhostProxy) {
                return activeSelectorParams.useGhostProxy(container, dragEl2);
              } else {
                return false;
              }
            };
          }
        }
        if (params.makeGhostProxy) {
          ghostProxy = params.makeGhostProxy;
        } else {
          ghostProxy = function(el2) {
            if (activeSelectorParams && activeSelectorParams.makeGhostProxy) {
              return activeSelectorParams.makeGhostProxy(el2);
            } else {
              return el2.cloneNode(true);
            }
          };
        }
        if (params.selector) {
          var draggableId = el.getAttribute("katavorio-draggable");
          if (draggableId == null) {
            draggableId = "" + (/* @__PURE__ */ new Date()).getTime();
            el.setAttribute("katavorio-draggable", draggableId);
          }
          availableSelectors.push(params);
        }
        var snapThreshold = params.snapThreshold, _snap = function(pos, gridX, gridY, thresholdX, thresholdY) {
          var _dx = Math.floor(pos[0] / gridX), _dxl = gridX * _dx, _dxt = _dxl + gridX, _x = Math.abs(pos[0] - _dxl) <= thresholdX ? _dxl : Math.abs(_dxt - pos[0]) <= thresholdX ? _dxt : pos[0];
          var _dy = Math.floor(pos[1] / gridY), _dyl = gridY * _dy, _dyt = _dyl + gridY, _y = Math.abs(pos[1] - _dyl) <= thresholdY ? _dyl : Math.abs(_dyt - pos[1]) <= thresholdY ? _dyt : pos[1];
          return [_x, _y];
        };
        this.posses = [];
        this.posseRoles = {};
        this.toGrid = function(pos) {
          if (this.params.grid == null) {
            return pos;
          } else {
            var tx = this.params.grid ? this.params.grid[0] / 2 : snapThreshold ? snapThreshold : DEFAULT_GRID_X / 2, ty = this.params.grid ? this.params.grid[1] / 2 : snapThreshold ? snapThreshold : DEFAULT_GRID_Y / 2;
            return _snap(pos, this.params.grid[0], this.params.grid[1], tx, ty);
          }
        };
        this.snap = function(x, y) {
          if (dragEl == null) return;
          x = x || (this.params.grid ? this.params.grid[0] : DEFAULT_GRID_X);
          y = y || (this.params.grid ? this.params.grid[1] : DEFAULT_GRID_Y);
          var p = this.params.getPosition(dragEl), tx = this.params.grid ? this.params.grid[0] / 2 : snapThreshold, ty = this.params.grid ? this.params.grid[1] / 2 : snapThreshold, snapped = _snap(p, x, y, tx, ty);
          this.params.setPosition(dragEl, snapped);
          return snapped;
        };
        this.setUseGhostProxy = function(val) {
          useGhostProxy = val ? TRUE : FALSE;
        };
        var constrain;
        var negativeFilter = function(pos) {
          return params.allowNegative === false ? [Math.max(0, pos[0]), Math.max(0, pos[1])] : pos;
        };
        var _setConstrain = (function(value) {
          constrain = typeof value === "function" ? value : value ? (function(pos, dragEl2, _constrainRect, _size) {
            return negativeFilter([
              Math.max(0, Math.min(_constrainRect.w - _size[0], pos[0])),
              Math.max(0, Math.min(_constrainRect.h - _size[1], pos[1]))
            ]);
          }).bind(this) : function(pos) {
            return negativeFilter(pos);
          };
        }).bind(this);
        _setConstrain(typeof this.params.constrain === "function" ? this.params.constrain : this.params.constrain || this.params.containment);
        this.setConstrain = function(value) {
          _setConstrain(value);
        };
        var _doConstrain = function(pos, dragEl2, _constrainRect, _size) {
          if (activeSelectorParams != null && activeSelectorParams.constrain && typeof activeSelectorParams.constrain === "function") {
            return activeSelectorParams.constrain(pos, dragEl2, _constrainRect, _size);
          } else {
            return constrain(pos, dragEl2, _constrainRect, _size);
          }
        };
        var revertFunction;
        this.setRevert = function(fn) {
          revertFunction = fn;
        };
        if (this.params.revert) {
          revertFunction = this.params.revert;
        }
        var _assignId = function(obj) {
          if (typeof obj === "function") {
            obj._katavorioId = _uuid();
            return obj._katavorioId;
          } else {
            return obj;
          }
        }, _filters = {}, _testFilter = function(e) {
          for (var key in _filters) {
            var f = _filters[key];
            var rv = f[0](e);
            if (f[1]) rv = !rv;
            if (!rv) return false;
          }
          return true;
        }, _setFilter = this.setFilter = function(f, _exclude) {
          if (f) {
            var key = _assignId(f);
            _filters[key] = [
              function(e) {
                var t = e.srcElement || e.target, m;
                if (_isString(f)) {
                  m = matchesSelector(t, f, el);
                } else if (typeof f === "function") {
                  m = f(e, el);
                }
                return m;
              },
              _exclude !== false
            ];
          }
        };
        this.addFilter = _setFilter;
        this.removeFilter = function(f) {
          var key = typeof f === "function" ? f._katavorioId : f;
          delete _filters[key];
        };
        this.clearAllFilters = function() {
          _filters = {};
        };
        this.canDrag = this.params.canDrag || _true;
        var constrainRect, matchingDroppables = [], intersectingDroppables = [];
        this.addSelector = function(params2) {
          if (params2.selector) {
            availableSelectors.push(params2);
          }
        };
        this.downListener = (function(e) {
          if (e.defaultPrevented) {
            return;
          }
          var isNotRightClick = this.rightButtonCanDrag || e.which !== 3 && e.button !== 2;
          if (isNotRightClick && this.isEnabled() && this.canDrag()) {
            var _f = _testFilter(e) && _inputFilter(e, this.el, this.k);
            if (_f) {
              activeSelectorParams = null;
              elementToDrag = null;
              if (availableSelectors.length > 0) {
                var match = findMatchingSelector(availableSelectors, this.el, e.target || e.srcElement);
                if (match != null) {
                  activeSelectorParams = match[0];
                  elementToDrag = match[1];
                }
                if (elementToDrag == null) {
                  return;
                }
              } else {
                elementToDrag = this.el;
              }
              if (clone) {
                dragEl = elementToDrag.cloneNode(true);
                this.params.addClass(dragEl, _classes.clonedDrag);
                dragEl.setAttribute("id", null);
                dragEl.style.position = "absolute";
                if (this.params.parent != null) {
                  var p = this.params.getPosition(this.el);
                  dragEl.style.left = p[0] + "px";
                  dragEl.style.top = p[1] + "px";
                  this.params.parent.appendChild(dragEl);
                } else {
                  var b = getOffsetRect(elementToDrag);
                  dragEl.style.left = b.left + "px";
                  dragEl.style.top = b.top + "px";
                  document.body.appendChild(dragEl);
                }
              } else {
                dragEl = elementToDrag;
              }
              consumeStartEvent && _consume(e);
              downAt = _pl(e);
              if (dragEl && dragEl.parentNode) {
                initialScroll = [dragEl.parentNode.scrollLeft, dragEl.parentNode.scrollTop];
              }
              this.params.bind(document, "mousemove", this.moveListener);
              this.params.bind(document, "mouseup", this.upListener);
              k.markSelection(this);
              k.markPosses(this);
              this.params.addClass(document.body, css.noSelect);
              _dispatch("beforeStart", { el: this.el, pos: posAtDown, e, drag: this });
            } else if (this.params.consumeFilteredEvents) {
              _consume(e);
            }
          }
        }).bind(this);
        this.moveListener = (function(e) {
          if (downAt) {
            if (!moving) {
              var _continue = _dispatch("start", { el: this.el, pos: posAtDown, e, drag: this });
              if (_continue !== false) {
                if (!downAt) {
                  return;
                }
                this.mark(true);
                moving = true;
              } else {
                this.abort();
              }
            }
            if (downAt) {
              intersectingDroppables.length = 0;
              var pos = _pl(e), dx = pos[0] - downAt[0], dy = pos[1] - downAt[1], z = this.params.ignoreZoom ? 1 : k.getZoom();
              if (dragEl && dragEl.parentNode) {
                dx += dragEl.parentNode.scrollLeft - initialScroll[0];
                dy += dragEl.parentNode.scrollTop - initialScroll[1];
              }
              dx /= z;
              dy /= z;
              this.moveBy(dx, dy, e);
              k.updateSelection(dx, dy, this);
              k.updatePosses(dx, dy, this);
            }
          }
        }).bind(this);
        this.upListener = (function(e) {
          if (downAt) {
            downAt = null;
            this.params.unbind(document, "mousemove", this.moveListener);
            this.params.unbind(document, "mouseup", this.upListener);
            this.params.removeClass(document.body, css.noSelect);
            this.unmark(e);
            k.unmarkSelection(this, e);
            k.unmarkPosses(this, e);
            this.stop(e);
            k.notifyPosseDragStop(this, e);
            moving = false;
            intersectingDroppables.length = 0;
            if (clone) {
              dragEl && dragEl.parentNode && dragEl.parentNode.removeChild(dragEl);
              dragEl = null;
            } else {
              if (revertFunction && revertFunction(dragEl, this.params.getPosition(dragEl)) === true) {
                this.params.setPosition(dragEl, posAtDown);
                _dispatch("revert", dragEl);
              }
            }
          }
        }).bind(this);
        this.getFilters = function() {
          return _filters;
        };
        this.abort = function() {
          if (downAt != null) {
            this.upListener();
          }
        };
        this.getDragElement = function(retrieveOriginalElement) {
          return retrieveOriginalElement ? elementToDrag || this.el : dragEl || this.el;
        };
        var listeners = { "start": [], "drag": [], "stop": [], "over": [], "out": [], "beforeStart": [], "revert": [] };
        if (params.events.start) listeners.start.push(params.events.start);
        if (params.events.beforeStart) listeners.beforeStart.push(params.events.beforeStart);
        if (params.events.stop) listeners.stop.push(params.events.stop);
        if (params.events.drag) listeners.drag.push(params.events.drag);
        if (params.events.revert) listeners.revert.push(params.events.revert);
        this.on = function(evt, fn) {
          if (listeners[evt]) listeners[evt].push(fn);
        };
        this.off = function(evt, fn) {
          if (listeners[evt]) {
            var l = [];
            for (var i = 0; i < listeners[evt].length; i++) {
              if (listeners[evt][i] !== fn) l.push(listeners[evt][i]);
            }
            listeners[evt] = l;
          }
        };
        var _dispatch = function(evt, value) {
          var result = null;
          if (activeSelectorParams && activeSelectorParams[evt]) {
            result = activeSelectorParams[evt](value);
          } else if (listeners[evt]) {
            for (var i = 0; i < listeners[evt].length; i++) {
              try {
                var v = listeners[evt][i](value);
                if (v != null) {
                  result = v;
                }
              } catch (e) {
              }
            }
          }
          return result;
        };
        this.notifyStart = function(e) {
          _dispatch("start", { el: this.el, pos: this.params.getPosition(dragEl), e, drag: this });
        };
        this.stop = function(e, force) {
          if (force || moving) {
            var positions = [], sel = k.getSelection(), dPos = this.params.getPosition(dragEl);
            if (sel.length > 0) {
              for (var i = 0; i < sel.length; i++) {
                var p = this.params.getPosition(sel[i].el);
                positions.push([sel[i].el, { left: p[0], top: p[1] }, sel[i]]);
              }
            } else {
              positions.push([dragEl, { left: dPos[0], top: dPos[1] }, this]);
            }
            _dispatch("stop", {
              el: dragEl,
              pos: ghostProxyOffsets || dPos,
              finalPos: dPos,
              e,
              drag: this,
              selection: positions
            });
          }
        };
        this.mark = function(andNotify) {
          posAtDown = this.params.getPosition(dragEl);
          pagePosAtDown = this.params.getPosition(dragEl, true);
          pageDelta = [pagePosAtDown[0] - posAtDown[0], pagePosAtDown[1] - posAtDown[1]];
          this.size = this.params.getSize(dragEl);
          matchingDroppables = k.getMatchingDroppables(this);
          _setDroppablesActive(matchingDroppables, true, false, this);
          this.params.addClass(dragEl, this.params.dragClass || css.drag);
          var cs;
          if (this.params.getConstrainingRectangle) {
            cs = this.params.getConstrainingRectangle(dragEl);
          } else {
            cs = this.params.getSize(dragEl.parentNode);
          }
          constrainRect = { w: cs[0], h: cs[1] };
          ghostDx = 0;
          ghostDy = 0;
          if (andNotify) {
            k.notifySelectionDragStart(this);
          }
        };
        var ghostProxyOffsets;
        this.unmark = function(e, doNotCheckDroppables) {
          _setDroppablesActive(matchingDroppables, false, true, this);
          if (isConstrained && useGhostProxy(elementToDrag, dragEl)) {
            ghostProxyOffsets = [dragEl.offsetLeft - ghostDx, dragEl.offsetTop - ghostDy];
            dragEl.parentNode.removeChild(dragEl);
            dragEl = elementToDrag;
          } else {
            ghostProxyOffsets = null;
          }
          this.params.removeClass(dragEl, this.params.dragClass || css.drag);
          matchingDroppables.length = 0;
          isConstrained = false;
          if (!doNotCheckDroppables) {
            if (intersectingDroppables.length > 0 && ghostProxyOffsets) {
              params.setPosition(elementToDrag, ghostProxyOffsets);
            }
            intersectingDroppables.sort(_rankSort);
            for (var i = 0; i < intersectingDroppables.length; i++) {
              var retVal = intersectingDroppables[i].drop(this, e);
              if (retVal === true) break;
            }
          }
        };
        this.moveBy = function(dx, dy, e) {
          intersectingDroppables.length = 0;
          var desiredLoc = this.toGrid([posAtDown[0] + dx, posAtDown[1] + dy]), cPos = _doConstrain(desiredLoc, dragEl, constrainRect, this.size);
          if (useGhostProxy(this.el, dragEl)) {
            if (desiredLoc[0] !== cPos[0] || desiredLoc[1] !== cPos[1]) {
              if (!isConstrained) {
                var gp = ghostProxy(elementToDrag);
                params.addClass(gp, _classes.ghostProxy);
                if (ghostProxyParent) {
                  ghostProxyParent.appendChild(gp);
                  currentParentPosition = params.getPosition(elementToDrag.parentNode, true);
                  ghostParentPosition = params.getPosition(params.ghostProxyParent, true);
                  ghostDx = currentParentPosition[0] - ghostParentPosition[0];
                  ghostDy = currentParentPosition[1] - ghostParentPosition[1];
                } else {
                  elementToDrag.parentNode.appendChild(gp);
                }
                dragEl = gp;
                isConstrained = true;
              }
              cPos = desiredLoc;
            } else {
              if (isConstrained) {
                dragEl.parentNode.removeChild(dragEl);
                dragEl = elementToDrag;
                isConstrained = false;
                currentParentPosition = null;
                ghostParentPosition = null;
                ghostDx = 0;
                ghostDy = 0;
              }
            }
          }
          var rect = { x: cPos[0], y: cPos[1], w: this.size[0], h: this.size[1] }, pageRect = { x: rect.x + pageDelta[0], y: rect.y + pageDelta[1], w: rect.w, h: rect.h }, focusDropElement = null;
          this.params.setPosition(dragEl, [cPos[0] + ghostDx, cPos[1] + ghostDy]);
          for (var i = 0; i < matchingDroppables.length; i++) {
            var r2 = { x: matchingDroppables[i].pagePosition[0], y: matchingDroppables[i].pagePosition[1], w: matchingDroppables[i].size[0], h: matchingDroppables[i].size[1] };
            if (this.params.intersects(pageRect, r2) && (_multipleDrop || focusDropElement == null || focusDropElement === matchingDroppables[i].el) && matchingDroppables[i].canDrop(this)) {
              if (!focusDropElement) focusDropElement = matchingDroppables[i].el;
              intersectingDroppables.push(matchingDroppables[i]);
              matchingDroppables[i].setHover(this, true, e);
            } else if (matchingDroppables[i].isHover()) {
              matchingDroppables[i].setHover(this, false, e);
            }
          }
          _dispatch("drag", { el: this.el, pos: cPos, e, drag: this });
        };
        this.destroy = function() {
          this.params.unbind(this.el, "mousedown", this.downListener);
          this.params.unbind(document, "mousemove", this.moveListener);
          this.params.unbind(document, "mouseup", this.upListener);
          this.downListener = null;
          this.upListener = null;
          this.moveListener = null;
        };
        this.params.bind(this.el, "mousedown", this.downListener);
        if (this.params.handle)
          _setFilter(this.params.handle, false);
        else
          _setFilter(this.params.filter, this.params.filterExclude);
      };
      var Drop = function(el, params, css, scope) {
        this._class = css.droppable;
        this.params = params || {};
        this.rank = params.rank || 0;
        this._activeClass = this.params.activeClass || css.active;
        this._hoverClass = this.params.hoverClass || css.hover;
        Super.apply(this, arguments);
        var hover = false;
        this.allowLoopback = this.params.allowLoopback !== false;
        this.setActive = function(val) {
          this.params[val ? "addClass" : "removeClass"](this.el, this._activeClass);
        };
        this.updatePosition = function() {
          this.position = this.params.getPosition(this.el);
          this.pagePosition = this.params.getPosition(this.el, true);
          this.size = this.params.getSize(this.el);
        };
        this.canDrop = this.params.canDrop || function(drag) {
          return true;
        };
        this.isHover = function() {
          return hover;
        };
        this.setHover = function(drag, val, e) {
          if (val || this.el._katavorioDragHover == null || this.el._katavorioDragHover === drag.el._katavorio) {
            this.params[val ? "addClass" : "removeClass"](this.el, this._hoverClass);
            this.el._katavorioDragHover = val ? drag.el._katavorio : null;
            if (hover !== val) {
              this.params.events[val ? "over" : "out"]({ el: this.el, e, drag, drop: this });
            }
            hover = val;
          }
        };
        this.drop = function(drag, event) {
          return this.params.events["drop"]({ drag, e: event, drop: this });
        };
        this.destroy = function() {
          this._class = null;
          this._activeClass = null;
          this._hoverClass = null;
          hover = null;
        };
      };
      var _uuid = function() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c === "x" ? r : r & 3 | 8;
          return v.toString(16);
        });
      };
      var _rankSort = function(a, b) {
        return a.rank < b.rank ? 1 : a.rank > b.rank ? -1 : 0;
      };
      var _gel = function(el) {
        if (el == null) return null;
        el = typeof el === "string" || el.constructor === String ? document.getElementById(el) : el;
        if (el == null) return null;
        el._katavorio = el._katavorio || _uuid();
        return el;
      };
      root.Katavorio = function(katavorioParams) {
        var _selection = [], _selectionMap = {};
        this._dragsByScope = {};
        this._dropsByScope = {};
        var _zoom = 1, _reg = function(obj, map) {
          _each(obj, function(_obj) {
            for (var i2 = 0; i2 < _obj.scopes.length; i2++) {
              map[_obj.scopes[i2]] = map[_obj.scopes[i2]] || [];
              map[_obj.scopes[i2]].push(_obj);
            }
          });
        }, _unreg = function(obj, map) {
          var c = 0;
          _each(obj, function(_obj) {
            for (var i2 = 0; i2 < _obj.scopes.length; i2++) {
              if (map[_obj.scopes[i2]]) {
                var idx = katavorioParams.indexOf(map[_obj.scopes[i2]], _obj);
                if (idx !== -1) {
                  map[_obj.scopes[i2]].splice(idx, 1);
                  c++;
                }
              }
            }
          });
          return c > 0;
        };
        this.getMatchingDroppables = function(drag) {
          var dd = [], _m = {};
          for (var i2 = 0; i2 < drag.scopes.length; i2++) {
            var _dd = this._dropsByScope[drag.scopes[i2]];
            if (_dd) {
              for (var j = 0; j < _dd.length; j++) {
                if (_dd[j].canDrop(drag) && !_m[_dd[j].uuid] && (_dd[j].allowLoopback || _dd[j].el !== drag.el)) {
                  _m[_dd[j].uuid] = true;
                  dd.push(_dd[j]);
                }
              }
            }
          }
          dd.sort(_rankSort);
          return dd;
        };
        var _prepareParams = (function(p) {
          p = p || {};
          var _p = {
            events: {}
          }, i2;
          for (i2 in katavorioParams) _p[i2] = katavorioParams[i2];
          for (i2 in p) _p[i2] = p[i2];
          for (i2 = 0; i2 < _events.length; i2++) {
            _p.events[_events[i2]] = p[_events[i2]] || _devNull;
          }
          _p.katavorio = this;
          return _p;
        }).bind(this), _mistletoe = (function(existingDrag, params) {
          for (var i2 = 0; i2 < _events.length; i2++) {
            if (params[_events[i2]]) {
              existingDrag.on(_events[i2], params[_events[i2]]);
            }
          }
        }).bind(this), _css = {}, overrideCss = katavorioParams.css || {}, _scope = katavorioParams.scope || _defaultScope;
        for (var i in _classes) _css[i] = _classes[i];
        for (var i in overrideCss) _css[i] = overrideCss[i];
        var inputFilterSelector = katavorioParams.inputFilterSelector || _defaultInputFilterSelector;
        this.getInputFilterSelector = function() {
          return inputFilterSelector;
        };
        this.setInputFilterSelector = function(selector) {
          inputFilterSelector = selector;
          return this;
        };
        this.draggable = function(el, params) {
          var o = [];
          _each(el, (function(_el) {
            _el = _gel(_el);
            if (_el != null) {
              if (_el._katavorioDrag == null) {
                var p = _prepareParams(params);
                _el._katavorioDrag = new Drag(_el, p, _css, _scope);
                _reg(_el._katavorioDrag, this._dragsByScope);
                o.push(_el._katavorioDrag);
                katavorioParams.addClass(_el, p.selector ? _css.delegatedDraggable : _css.draggable);
              } else {
                _mistletoe(_el._katavorioDrag, params);
              }
            }
          }).bind(this));
          return o;
        };
        this.droppable = function(el, params) {
          var o = [];
          _each(el, (function(_el) {
            _el = _gel(_el);
            if (_el != null) {
              var drop = new Drop(_el, _prepareParams(params), _css, _scope);
              _el._katavorioDrop = _el._katavorioDrop || [];
              _el._katavorioDrop.push(drop);
              _reg(drop, this._dropsByScope);
              o.push(drop);
              katavorioParams.addClass(_el, _css.droppable);
            }
          }).bind(this));
          return o;
        };
        this.select = function(el) {
          _each(el, function() {
            var _el = _gel(this);
            if (_el && _el._katavorioDrag) {
              if (!_selectionMap[_el._katavorio]) {
                _selection.push(_el._katavorioDrag);
                _selectionMap[_el._katavorio] = [_el, _selection.length - 1];
                katavorioParams.addClass(_el, _css.selected);
              }
            }
          });
          return this;
        };
        this.deselect = function(el) {
          _each(el, function() {
            var _el = _gel(this);
            if (_el && _el._katavorio) {
              var e = _selectionMap[_el._katavorio];
              if (e) {
                var _s = [];
                for (var i2 = 0; i2 < _selection.length; i2++)
                  if (_selection[i2].el !== _el) _s.push(_selection[i2]);
                _selection = _s;
                delete _selectionMap[_el._katavorio];
                katavorioParams.removeClass(_el, _css.selected);
              }
            }
          });
          return this;
        };
        this.deselectAll = function() {
          for (var i2 in _selectionMap) {
            var d = _selectionMap[i2];
            katavorioParams.removeClass(d[0], _css.selected);
          }
          _selection.length = 0;
          _selectionMap = {};
        };
        this.markSelection = function(drag) {
          _foreach(_selection, function(e) {
            e.mark();
          }, drag);
        };
        this.markPosses = function(drag) {
          if (drag.posses) {
            _each(drag.posses, function(p) {
              if (drag.posseRoles[p] && _posses[p]) {
                _foreach(_posses[p].members, function(d) {
                  d.mark();
                }, drag);
              }
            });
          }
        };
        this.unmarkSelection = function(drag, event) {
          _foreach(_selection, function(e) {
            e.unmark(event);
          }, drag);
        };
        this.unmarkPosses = function(drag, event) {
          if (drag.posses) {
            _each(drag.posses, function(p) {
              if (drag.posseRoles[p] && _posses[p]) {
                _foreach(_posses[p].members, function(d) {
                  d.unmark(event, true);
                }, drag);
              }
            });
          }
        };
        this.getSelection = function() {
          return _selection.slice(0);
        };
        this.updateSelection = function(dx, dy, drag) {
          _foreach(_selection, function(e) {
            e.moveBy(dx, dy);
          }, drag);
        };
        var _posseAction = function(fn, drag) {
          if (drag.posses) {
            _each(drag.posses, function(p) {
              if (drag.posseRoles[p] && _posses[p]) {
                _foreach(_posses[p].members, function(e) {
                  fn(e);
                }, drag);
              }
            });
          }
        };
        this.updatePosses = function(dx, dy, drag) {
          _posseAction(function(e) {
            e.moveBy(dx, dy);
          }, drag);
        };
        this.notifyPosseDragStop = function(drag, evt) {
          _posseAction(function(e) {
            e.stop(evt, true);
          }, drag);
        };
        this.notifySelectionDragStop = function(drag, evt) {
          _foreach(_selection, function(e) {
            e.stop(evt, true);
          }, drag);
        };
        this.notifySelectionDragStart = function(drag, evt) {
          _foreach(_selection, function(e) {
            e.notifyStart(evt);
          }, drag);
        };
        this.setZoom = function(z) {
          _zoom = z;
        };
        this.getZoom = function() {
          return _zoom;
        };
        var _scopeManip = function(kObj, scopes, map, fn) {
          _each(kObj, function(_kObj) {
            _unreg(_kObj, map);
            _kObj[fn](scopes);
            _reg(_kObj, map);
          });
        };
        _each(["set", "add", "remove", "toggle"], (function(v) {
          this[v + "Scope"] = (function(el, scopes) {
            _scopeManip(el._katavorioDrag, scopes, this._dragsByScope, v + "Scope");
            _scopeManip(el._katavorioDrop, scopes, this._dropsByScope, v + "Scope");
          }).bind(this);
          this[v + "DragScope"] = (function(el, scopes) {
            _scopeManip(el.constructor === Drag ? el : el._katavorioDrag, scopes, this._dragsByScope, v + "Scope");
          }).bind(this);
          this[v + "DropScope"] = (function(el, scopes) {
            _scopeManip(el.constructor === Drop ? el : el._katavorioDrop, scopes, this._dropsByScope, v + "Scope");
          }).bind(this);
        }).bind(this));
        this.snapToGrid = function(x, y) {
          for (var s in this._dragsByScope) {
            _foreach(this._dragsByScope[s], function(d) {
              d.snap(x, y);
            });
          }
        };
        this.getDragsForScope = function(s) {
          return this._dragsByScope[s];
        };
        this.getDropsForScope = function(s) {
          return this._dropsByScope[s];
        };
        var _destroy = function(el, type, map) {
          el = _gel(el);
          if (el[type]) {
            var selIdx = _selection.indexOf(el[type]);
            if (selIdx >= 0) {
              _selection.splice(selIdx, 1);
            }
            if (_unreg(el[type], map)) {
              _each(el[type], function(kObj) {
                kObj.destroy();
              });
            }
            delete el[type];
          }
        };
        var _removeListener = function(el, type, evt, fn) {
          el = _gel(el);
          if (el[type]) {
            el[type].off(evt, fn);
          }
        };
        this.elementRemoved = function(el) {
          if (el["_katavorioDrag"]) {
            this.destroyDraggable(el);
          }
          if (el["_katavorioDrop"]) {
            this.destroyDroppable(el);
          }
        };
        this.destroyDraggable = function(el, evt, fn) {
          if (arguments.length === 1) {
            _destroy(el, "_katavorioDrag", this._dragsByScope);
          } else {
            _removeListener(el, "_katavorioDrag", evt, fn);
          }
        };
        this.destroyDroppable = function(el, evt, fn) {
          if (arguments.length === 1) {
            _destroy(el, "_katavorioDrop", this._dropsByScope);
          } else {
            _removeListener(el, "_katavorioDrop", evt, fn);
          }
        };
        this.reset = function() {
          this._dragsByScope = {};
          this._dropsByScope = {};
          _selection = [];
          _selectionMap = {};
          _posses = {};
        };
        var _posses = {};
        var _processOneSpec = function(el, _spec, dontAddExisting) {
          var posseId = _isString(_spec) ? _spec : _spec.id;
          var active = _isString(_spec) ? true : _spec.active !== false;
          var posse = _posses[posseId] || function() {
            var g = { name: posseId, members: [] };
            _posses[posseId] = g;
            return g;
          }();
          _each(el, function(_el) {
            if (_el._katavorioDrag) {
              if (dontAddExisting && _el._katavorioDrag.posseRoles[posse.name] != null) return;
              _suggest(posse.members, _el._katavorioDrag);
              _suggest(_el._katavorioDrag.posses, posse.name);
              _el._katavorioDrag.posseRoles[posse.name] = active;
            }
          });
          return posse;
        };
        this.addToPosse = function(el, spec) {
          var posses = [];
          for (var i2 = 1; i2 < arguments.length; i2++) {
            posses.push(_processOneSpec(el, arguments[i2]));
          }
          return posses.length === 1 ? posses[0] : posses;
        };
        this.setPosse = function(el, spec) {
          var posses = [];
          for (var i2 = 1; i2 < arguments.length; i2++) {
            posses.push(_processOneSpec(el, arguments[i2], true).name);
          }
          _each(el, (function(_el) {
            if (_el._katavorioDrag) {
              var diff = _difference(_el._katavorioDrag.posses, posses);
              var p = [];
              Array.prototype.push.apply(p, _el._katavorioDrag.posses);
              for (var i3 = 0; i3 < diff.length; i3++) {
                this.removeFromPosse(_el, diff[i3]);
              }
            }
          }).bind(this));
          return posses.length === 1 ? posses[0] : posses;
        };
        this.removeFromPosse = function(el, posseId) {
          if (arguments.length < 2) throw new TypeError("No posse id provided for remove operation");
          for (var i2 = 1; i2 < arguments.length; i2++) {
            posseId = arguments[i2];
            _each(el, function(_el) {
              if (_el._katavorioDrag && _el._katavorioDrag.posses) {
                var d = _el._katavorioDrag;
                _each(posseId, function(p) {
                  _vanquish(_posses[p].members, d);
                  _vanquish(d.posses, p);
                  delete d.posseRoles[p];
                });
              }
            });
          }
        };
        this.removeFromAllPosses = function(el) {
          _each(el, function(_el) {
            if (_el._katavorioDrag && _el._katavorioDrag.posses) {
              var d = _el._katavorioDrag;
              _each(d.posses, function(p) {
                _vanquish(_posses[p].members, d);
              });
              d.posses.length = 0;
              d.posseRoles = {};
            }
          });
        };
        this.setPosseState = function(el, posseId, state) {
          var posse = _posses[posseId];
          if (posse) {
            _each(el, function(_el) {
              if (_el._katavorioDrag && _el._katavorioDrag.posses) {
                _el._katavorioDrag.posseRoles[posse.name] = state;
              }
            });
          }
        };
      };
      root.Katavorio.version = "1.0.0";
      {
        exports.Katavorio = root.Katavorio;
      }
    }).call(typeof window !== "undefined" ? window : jsplumb);
    (function() {
      var root = this;
      root.jsPlumbUtil = root.jsPlumbUtil || {};
      var jsPlumbUtil2 = root.jsPlumbUtil;
      {
        exports.jsPlumbUtil = jsPlumbUtil2;
      }
      function isArray(a) {
        return Object.prototype.toString.call(a) === "[object Array]";
      }
      jsPlumbUtil2.isArray = isArray;
      function isNumber(n) {
        return Object.prototype.toString.call(n) === "[object Number]";
      }
      jsPlumbUtil2.isNumber = isNumber;
      function isString(s) {
        return typeof s === "string";
      }
      jsPlumbUtil2.isString = isString;
      function isBoolean(s) {
        return typeof s === "boolean";
      }
      jsPlumbUtil2.isBoolean = isBoolean;
      function isNull(s) {
        return s == null;
      }
      jsPlumbUtil2.isNull = isNull;
      function isObject(o) {
        return o == null ? false : Object.prototype.toString.call(o) === "[object Object]";
      }
      jsPlumbUtil2.isObject = isObject;
      function isDate(o) {
        return Object.prototype.toString.call(o) === "[object Date]";
      }
      jsPlumbUtil2.isDate = isDate;
      function isFunction(o) {
        return Object.prototype.toString.call(o) === "[object Function]";
      }
      jsPlumbUtil2.isFunction = isFunction;
      function isNamedFunction(o) {
        return isFunction(o) && o.name != null && o.name.length > 0;
      }
      jsPlumbUtil2.isNamedFunction = isNamedFunction;
      function isEmpty(o) {
        for (var i2 in o) {
          if (o.hasOwnProperty(i2)) {
            return false;
          }
        }
        return true;
      }
      jsPlumbUtil2.isEmpty = isEmpty;
      function clone(a) {
        if (isString(a)) {
          return "" + a;
        } else if (isBoolean(a)) {
          return !!a;
        } else if (isDate(a)) {
          return new Date(a.getTime());
        } else if (isFunction(a)) {
          return a;
        } else if (isArray(a)) {
          var b = [];
          for (var i2 = 0; i2 < a.length; i2++) {
            b.push(clone(a[i2]));
          }
          return b;
        } else if (isObject(a)) {
          var c = {};
          for (var j in a) {
            c[j] = clone(a[j]);
          }
          return c;
        } else {
          return a;
        }
      }
      jsPlumbUtil2.clone = clone;
      function merge(a, b, collations, overwrites) {
        var cMap = {}, ar, i2, oMap = {};
        collations = collations || [];
        overwrites = overwrites || [];
        for (i2 = 0; i2 < collations.length; i2++) {
          cMap[collations[i2]] = true;
        }
        for (i2 = 0; i2 < overwrites.length; i2++) {
          oMap[overwrites[i2]] = true;
        }
        var c = clone(a);
        for (i2 in b) {
          if (c[i2] == null || oMap[i2]) {
            c[i2] = b[i2];
          } else if (isString(b[i2]) || isBoolean(b[i2])) {
            if (!cMap[i2]) {
              c[i2] = b[i2];
            } else {
              ar = [];
              ar.push.apply(ar, isArray(c[i2]) ? c[i2] : [c[i2]]);
              ar.push.apply(ar, isBoolean(b[i2]) ? b[i2] : [b[i2]]);
              c[i2] = ar;
            }
          } else {
            if (isArray(b[i2])) {
              ar = [];
              if (isArray(c[i2])) {
                ar.push.apply(ar, c[i2]);
              }
              ar.push.apply(ar, b[i2]);
              c[i2] = ar;
            } else if (isObject(b[i2])) {
              if (!isObject(c[i2])) {
                c[i2] = {};
              }
              for (var j in b[i2]) {
                c[i2][j] = b[i2][j];
              }
            }
          }
        }
        return c;
      }
      jsPlumbUtil2.merge = merge;
      function replace(inObj, path, value) {
        if (inObj == null) {
          return;
        }
        var q = inObj, t = q;
        path.replace(/([^\.])+/g, function(term, lc, pos, str) {
          var array = term.match(/([^\[0-9]+){1}(\[)([0-9+])/), last = pos + term.length >= str.length, _getArray = function() {
            return t[array[1]] || function() {
              t[array[1]] = [];
              return t[array[1]];
            }();
          };
          if (last) {
            if (array) {
              _getArray()[array[3]] = value;
            } else {
              t[term] = value;
            }
          } else {
            if (array) {
              var a_1 = _getArray();
              t = a_1[array[3]] || function() {
                a_1[array[3]] = {};
                return a_1[array[3]];
              }();
            } else {
              t = t[term] || function() {
                t[term] = {};
                return t[term];
              }();
            }
          }
          return "";
        });
        return inObj;
      }
      jsPlumbUtil2.replace = replace;
      function functionChain(successValue, failValue, fns) {
        for (var i2 = 0; i2 < fns.length; i2++) {
          var o = fns[i2][0][fns[i2][1]].apply(fns[i2][0], fns[i2][2]);
          if (o === failValue) {
            return o;
          }
        }
        return successValue;
      }
      jsPlumbUtil2.functionChain = functionChain;
      function populate(model, values, functionPrefix, doNotExpandFunctions) {
        var getValue = function(fromString) {
          var matches = fromString.match(/(\${.*?})/g);
          if (matches != null) {
            for (var i2 = 0; i2 < matches.length; i2++) {
              var val = values[matches[i2].substring(2, matches[i2].length - 1)] || "";
              if (val != null) {
                fromString = fromString.replace(matches[i2], val);
              }
            }
          }
          return fromString;
        };
        var _one = function(d) {
          if (d != null) {
            if (isString(d)) {
              return getValue(d);
            } else if (isFunction(d) && !doNotExpandFunctions && (functionPrefix == null || (d.name || "").indexOf(functionPrefix) === 0)) {
              return d(values);
            } else if (isArray(d)) {
              var r = [];
              for (var i2 = 0; i2 < d.length; i2++) {
                r.push(_one(d[i2]));
              }
              return r;
            } else if (isObject(d)) {
              var s = {};
              for (var j in d) {
                s[j] = _one(d[j]);
              }
              return s;
            } else {
              return d;
            }
          }
        };
        return _one(model);
      }
      jsPlumbUtil2.populate = populate;
      function findWithFunction(a, f) {
        if (a) {
          for (var i2 = 0; i2 < a.length; i2++) {
            if (f(a[i2])) {
              return i2;
            }
          }
        }
        return -1;
      }
      jsPlumbUtil2.findWithFunction = findWithFunction;
      function removeWithFunction(a, f) {
        var idx = findWithFunction(a, f);
        if (idx > -1) {
          a.splice(idx, 1);
        }
        return idx !== -1;
      }
      jsPlumbUtil2.removeWithFunction = removeWithFunction;
      function remove(l, v) {
        var idx = l.indexOf(v);
        if (idx > -1) {
          l.splice(idx, 1);
        }
        return idx !== -1;
      }
      jsPlumbUtil2.remove = remove;
      function addWithFunction(list, item, hashFunction) {
        if (findWithFunction(list, hashFunction) === -1) {
          list.push(item);
        }
      }
      jsPlumbUtil2.addWithFunction = addWithFunction;
      function addToList(map2, key, value, insertAtStart) {
        var l = map2[key];
        if (l == null) {
          l = [];
          map2[key] = l;
        }
        l[insertAtStart ? "unshift" : "push"](value);
        return l;
      }
      jsPlumbUtil2.addToList = addToList;
      function suggest(list, item, insertAtHead) {
        if (list.indexOf(item) === -1) {
          if (insertAtHead) {
            list.unshift(item);
          } else {
            list.push(item);
          }
          return true;
        }
        return false;
      }
      jsPlumbUtil2.suggest = suggest;
      function extend(child, parent, _protoFn) {
        var i2;
        parent = isArray(parent) ? parent : [parent];
        var _copyProtoChain = function(focus) {
          var proto = focus.__proto__;
          while (proto != null) {
            if (proto.prototype != null) {
              for (var j2 in proto.prototype) {
                if (proto.prototype.hasOwnProperty(j2) && !child.prototype.hasOwnProperty(j2)) {
                  child.prototype[j2] = proto.prototype[j2];
                }
              }
              proto = proto.prototype.__proto__;
            } else {
              proto = null;
            }
          }
        };
        for (i2 = 0; i2 < parent.length; i2++) {
          for (var j in parent[i2].prototype) {
            if (parent[i2].prototype.hasOwnProperty(j) && !child.prototype.hasOwnProperty(j)) {
              child.prototype[j] = parent[i2].prototype[j];
            }
          }
          _copyProtoChain(parent[i2]);
        }
        var _makeFn = function(name, protoFn) {
          return function() {
            for (i2 = 0; i2 < parent.length; i2++) {
              if (parent[i2].prototype[name]) {
                parent[i2].prototype[name].apply(this, arguments);
              }
            }
            return protoFn.apply(this, arguments);
          };
        };
        var _oneSet = function(fns) {
          for (var k in fns) {
            child.prototype[k] = _makeFn(k, fns[k]);
          }
        };
        if (arguments.length > 2) {
          for (i2 = 2; i2 < arguments.length; i2++) {
            _oneSet(arguments[i2]);
          }
        }
        return child;
      }
      jsPlumbUtil2.extend = extend;
      var lut = [];
      for (var i = 0; i < 256; i++) {
        lut[i] = (i < 16 ? "0" : "") + i.toString(16);
      }
      function uuid() {
        var d0 = Math.random() * 4294967295 | 0;
        var d1 = Math.random() * 4294967295 | 0;
        var d2 = Math.random() * 4294967295 | 0;
        var d3 = Math.random() * 4294967295 | 0;
        return lut[d0 & 255] + lut[d0 >> 8 & 255] + lut[d0 >> 16 & 255] + lut[d0 >> 24 & 255] + "-" + lut[d1 & 255] + lut[d1 >> 8 & 255] + "-" + lut[d1 >> 16 & 15 | 64] + lut[d1 >> 24 & 255] + "-" + lut[d2 & 63 | 128] + lut[d2 >> 8 & 255] + "-" + lut[d2 >> 16 & 255] + lut[d2 >> 24 & 255] + lut[d3 & 255] + lut[d3 >> 8 & 255] + lut[d3 >> 16 & 255] + lut[d3 >> 24 & 255];
      }
      jsPlumbUtil2.uuid = uuid;
      function fastTrim(s) {
        if (s == null) {
          return null;
        }
        var str = s.replace(/^\s\s*/, ""), ws = /\s/, i2 = str.length;
        while (ws.test(str.charAt(--i2))) {
        }
        return str.slice(0, i2 + 1);
      }
      jsPlumbUtil2.fastTrim = fastTrim;
      function each(obj, fn) {
        obj = obj.length == null || typeof obj === "string" ? [obj] : obj;
        for (var i2 = 0; i2 < obj.length; i2++) {
          fn(obj[i2]);
        }
      }
      jsPlumbUtil2.each = each;
      function map(obj, fn) {
        var o = [];
        for (var i2 = 0; i2 < obj.length; i2++) {
          o.push(fn(obj[i2]));
        }
        return o;
      }
      jsPlumbUtil2.map = map;
      function mergeWithParents(type, map2, parentAttribute) {
        parentAttribute = parentAttribute || "parent";
        var _def = function(id) {
          return id ? map2[id] : null;
        };
        var _parent = function(def) {
          return def ? _def(def[parentAttribute]) : null;
        };
        var _one = function(parent, def) {
          if (parent == null) {
            return def;
          } else {
            var overrides = ["anchor", "anchors", "cssClass", "connector", "paintStyle", "hoverPaintStyle", "endpoint", "endpoints"];
            if (def.mergeStrategy === "override") {
              Array.prototype.push.apply(overrides, ["events", "overlays"]);
            }
            var d_1 = merge(parent, def, [], overrides);
            return _one(_parent(parent), d_1);
          }
        };
        var _getDef = function(t) {
          if (t == null) {
            return {};
          }
          if (typeof t === "string") {
            return _def(t);
          } else if (t.length) {
            var done = false, i2 = 0, _dd = void 0;
            while (!done && i2 < t.length) {
              _dd = _getDef(t[i2]);
              if (_dd) {
                done = true;
              } else {
                i2++;
              }
            }
            return _dd;
          }
        };
        var d = _getDef(type);
        if (d) {
          return _one(_parent(d), d);
        } else {
          return {};
        }
      }
      jsPlumbUtil2.mergeWithParents = mergeWithParents;
      jsPlumbUtil2.logEnabled = true;
      function log() {
        if (jsPlumbUtil2.logEnabled && typeof console !== "undefined") {
          try {
            var msg = arguments[arguments.length - 1];
            console.log(msg);
          } catch (e) {
          }
        }
      }
      jsPlumbUtil2.log = log;
      function wrap(wrappedFunction, newFunction, returnOnThisValue) {
        return function() {
          var r = null;
          try {
            if (newFunction != null) {
              r = newFunction.apply(this, arguments);
            }
          } catch (e) {
            log("jsPlumb function failed : " + e);
          }
          if (wrappedFunction != null && (returnOnThisValue == null || r !== returnOnThisValue)) {
            try {
              r = wrappedFunction.apply(this, arguments);
            } catch (e) {
              log("wrapped function failed : " + e);
            }
          }
          return r;
        };
      }
      jsPlumbUtil2.wrap = wrap;
      var EventGenerator = (
        /** @class */
        /* @__PURE__ */ function() {
          function EventGenerator2() {
            var _this = this;
            this._listeners = {};
            this.eventsSuspended = false;
            this.tick = false;
            this.eventsToDieOn = { "ready": true };
            this.queue = [];
            this.bind = function(event, listener, insertAtStart) {
              var _one = function(evt) {
                addToList(_this._listeners, evt, listener, insertAtStart);
                listener.__jsPlumb = listener.__jsPlumb || {};
                listener.__jsPlumb[uuid()] = evt;
              };
              if (typeof event === "string") {
                _one(event);
              } else if (event.length != null) {
                for (var i2 = 0; i2 < event.length; i2++) {
                  _one(event[i2]);
                }
              }
              return _this;
            };
            this.fire = function(event, value, originalEvent) {
              if (!this.tick) {
                this.tick = true;
                if (!this.eventsSuspended && this._listeners[event]) {
                  var l = this._listeners[event].length, i2 = 0, _gone = false, ret = null;
                  if (!this.shouldFireEvent || this.shouldFireEvent(event, value, originalEvent)) {
                    while (!_gone && i2 < l && ret !== false) {
                      if (this.eventsToDieOn[event]) {
                        this._listeners[event][i2].apply(this, [value, originalEvent]);
                      } else {
                        try {
                          ret = this._listeners[event][i2].apply(this, [value, originalEvent]);
                        } catch (e) {
                          log("jsPlumb: fire failed for event " + event + " : " + e);
                        }
                      }
                      i2++;
                      if (this._listeners == null || this._listeners[event] == null) {
                        _gone = true;
                      }
                    }
                  }
                }
                this.tick = false;
                this._drain();
              } else {
                this.queue.unshift(arguments);
              }
              return this;
            };
            this._drain = function() {
              var n = _this.queue.pop();
              if (n) {
                _this.fire.apply(_this, n);
              }
            };
            this.unbind = function(eventOrListener, listener) {
              if (arguments.length === 0) {
                this._listeners = {};
              } else if (arguments.length === 1) {
                if (typeof eventOrListener === "string") {
                  delete this._listeners[eventOrListener];
                } else if (eventOrListener.__jsPlumb) {
                  var evt = void 0;
                  for (var i2 in eventOrListener.__jsPlumb) {
                    evt = eventOrListener.__jsPlumb[i2];
                    remove(this._listeners[evt] || [], eventOrListener);
                  }
                }
              } else if (arguments.length === 2) {
                remove(this._listeners[eventOrListener] || [], listener);
              }
              return this;
            };
            this.getListener = function(forEvent) {
              return _this._listeners[forEvent];
            };
            this.setSuspendEvents = function(val) {
              _this.eventsSuspended = val;
            };
            this.isSuspendEvents = function() {
              return _this.eventsSuspended;
            };
            this.silently = function(fn) {
              _this.setSuspendEvents(true);
              try {
                fn();
              } catch (e) {
                log("Cannot execute silent function " + e);
              }
              _this.setSuspendEvents(false);
            };
            this.cleanupListeners = function() {
              for (var i2 in _this._listeners) {
                _this._listeners[i2] = null;
              }
            };
          }
          return EventGenerator2;
        }()
      );
      jsPlumbUtil2.EventGenerator = EventGenerator;
      function rotatePoint(point, center, rotation) {
        var radial = [point[0] - center[0], point[1] - center[1]], cr = Math.cos(rotation / 360 * Math.PI * 2), sr = Math.sin(rotation / 360 * Math.PI * 2);
        return [
          radial[0] * cr - radial[1] * sr + center[0],
          radial[1] * cr + radial[0] * sr + center[1],
          cr,
          sr
        ];
      }
      jsPlumbUtil2.rotatePoint = rotatePoint;
      function rotateAnchorOrientation(orientation, rotation) {
        var r = rotatePoint(orientation, [0, 0], rotation);
        return [
          Math.round(r[0]),
          Math.round(r[1])
        ];
      }
      jsPlumbUtil2.rotateAnchorOrientation = rotateAnchorOrientation;
    }).call(typeof window !== "undefined" ? window : jsplumb);
    (function() {
      var root = this;
      root.jsPlumbUtil.matchesSelector = function(el, selector, ctx) {
        ctx = ctx || el.parentNode;
        var possibles = ctx.querySelectorAll(selector);
        for (var i = 0; i < possibles.length; i++) {
          if (possibles[i] === el) {
            return true;
          }
        }
        return false;
      };
      root.jsPlumbUtil.consume = function(e, doNotPreventDefault) {
        if (e.stopPropagation) {
          e.stopPropagation();
        } else {
          e.returnValue = false;
        }
        if (!doNotPreventDefault && e.preventDefault) {
          e.preventDefault();
        }
      };
      root.jsPlumbUtil.sizeElement = function(el, x, y, w, h) {
        if (el) {
          el.style.height = h + "px";
          el.height = h;
          el.style.width = w + "px";
          el.width = w;
          el.style.left = x + "px";
          el.style.top = y + "px";
        }
      };
    }).call(typeof window !== "undefined" ? window : jsplumb);
    (function() {
      var DEFAULT_OPTIONS = {
        deriveAnchor: function(edge, index, ep, conn) {
          return {
            top: ["TopRight", "TopLeft"],
            bottom: ["BottomRight", "BottomLeft"]
          }[edge][index];
        }
      };
      var root = this;
      var ListManager = function(jsPlumbInstance, params) {
        this.count = 0;
        this.instance = jsPlumbInstance;
        this.lists = {};
        this.options = params || {};
        this.instance.addList = function(el, options) {
          return this.listManager.addList(el, options);
        };
        this.instance.removeList = function(el) {
          this.listManager.removeList(el);
        };
        this.instance.bind("manageElement", (function(p) {
          var scrollableLists = this.instance.getSelector(p.el, "[jtk-scrollable-list]");
          for (var i = 0; i < scrollableLists.length; i++) {
            this.addList(scrollableLists[i]);
          }
        }).bind(this));
        this.instance.bind("unmanageElement", function(p) {
          this.removeList(p.el);
        });
        this.instance.bind("connection", (function(c, evt) {
          if (evt == null) {
            this._maybeUpdateParentList(c.source);
            this._maybeUpdateParentList(c.target);
          }
        }).bind(this));
      };
      root.jsPlumbListManager = ListManager;
      ListManager.prototype = {
        addList: function(el, options) {
          var dp = this.instance.extend({}, DEFAULT_OPTIONS);
          this.instance.extend(dp, this.options);
          options = this.instance.extend(dp, options || {});
          var id = [this.instance.getInstanceIndex(), this.count++].join("_");
          this.lists[id] = new List(this.instance, el, options, id);
        },
        removeList: function(el) {
          var list = this.lists[el._jsPlumbList];
          if (list) {
            list.destroy();
            delete this.lists[el._jsPlumbList];
          }
        },
        _maybeUpdateParentList: function(el) {
          var parent = el.parentNode, container = this.instance.getContainer();
          while (parent != null && parent !== container) {
            if (parent._jsPlumbList != null && this.lists[parent._jsPlumbList] != null) {
              parent._jsPlumbScrollHandler();
              return;
            }
            parent = parent.parentNode;
          }
        }
      };
      var List = function(instance, el, options, id) {
        el["_jsPlumbList"] = id;
        function deriveAnchor(edge, index, ep, conn) {
          return options.anchor ? options.anchor : options.deriveAnchor(edge, index, ep, conn);
        }
        function deriveEndpoint(edge, index, ep, conn) {
          return options.deriveEndpoint ? options.deriveEndpoint(edge, index, ep, conn) : options.endpoint ? options.endpoint : ep.type;
        }
        function _maybeUpdateDraggable(el2) {
          var parent = el2.parentNode, container = instance.getContainer();
          while (parent != null && parent !== container) {
            if (instance.hasClass(parent, "jtk-managed")) {
              instance.recalculateOffsets(parent);
              return;
            }
            parent = parent.parentNode;
          }
        }
        var scrollHandler = function(e) {
          var children = instance.getSelector(el, ".jtk-managed");
          var elId = instance.getId(el);
          for (var i = 0; i < children.length; i++) {
            if (children[i].offsetTop < el.scrollTop) {
              if (!children[i]._jsPlumbProxies) {
                children[i]._jsPlumbProxies = children[i]._jsPlumbProxies || [];
                instance.select({ source: children[i] }).each(function(c) {
                  instance.proxyConnection(c, 0, el, elId, function() {
                    return deriveEndpoint("top", 0, c.endpoints[0], c);
                  }, function() {
                    return deriveAnchor("top", 0, c.endpoints[0], c);
                  });
                  children[i]._jsPlumbProxies.push([c, 0]);
                });
                instance.select({ target: children[i] }).each(function(c) {
                  instance.proxyConnection(c, 1, el, elId, function() {
                    return deriveEndpoint("top", 1, c.endpoints[1], c);
                  }, function() {
                    return deriveAnchor("top", 1, c.endpoints[1], c);
                  });
                  children[i]._jsPlumbProxies.push([c, 1]);
                });
              }
            } else if (children[i].offsetTop + children[i].offsetHeight > el.scrollTop + el.offsetHeight) {
              if (!children[i]._jsPlumbProxies) {
                children[i]._jsPlumbProxies = children[i]._jsPlumbProxies || [];
                instance.select({ source: children[i] }).each(function(c) {
                  instance.proxyConnection(c, 0, el, elId, function() {
                    return deriveEndpoint("bottom", 0, c.endpoints[0], c);
                  }, function() {
                    return deriveAnchor("bottom", 0, c.endpoints[0], c);
                  });
                  children[i]._jsPlumbProxies.push([c, 0]);
                });
                instance.select({ target: children[i] }).each(function(c) {
                  instance.proxyConnection(c, 1, el, elId, function() {
                    return deriveEndpoint("bottom", 1, c.endpoints[1], c);
                  }, function() {
                    return deriveAnchor("bottom", 1, c.endpoints[1], c);
                  });
                  children[i]._jsPlumbProxies.push([c, 1]);
                });
              }
            } else if (children[i]._jsPlumbProxies) {
              for (var j = 0; j < children[i]._jsPlumbProxies.length; j++) {
                instance.unproxyConnection(children[i]._jsPlumbProxies[j][0], children[i]._jsPlumbProxies[j][1], elId);
              }
              delete children[i]._jsPlumbProxies;
            }
            instance.revalidate(children[i]);
          }
          _maybeUpdateDraggable(el);
        };
        instance.setAttribute(el, "jtk-scrollable-list", "true");
        el._jsPlumbScrollHandler = scrollHandler;
        instance.on(el, "scroll", scrollHandler);
        scrollHandler();
        this.destroy = function() {
          instance.off(el, "scroll", scrollHandler);
          delete el._jsPlumbScrollHandler;
          var children = instance.getSelector(el, ".jtk-managed");
          var elId = instance.getId(el);
          for (var i = 0; i < children.length; i++) {
            if (children[i]._jsPlumbProxies) {
              for (var j = 0; j < children[i]._jsPlumbProxies.length; j++) {
                instance.unproxyConnection(children[i]._jsPlumbProxies[j][0], children[i]._jsPlumbProxies[j][1], elId);
              }
              delete children[i]._jsPlumbProxies;
            }
          }
        };
      };
    }).call(typeof window !== "undefined" ? window : jsplumb);
    (function() {
      var root = this;
      var _ju = root.jsPlumbUtil, _updateHoverStyle = function(component) {
        if (component._jsPlumb.paintStyle && component._jsPlumb.hoverPaintStyle) {
          var mergedHoverStyle = {};
          jsPlumb2.extend(mergedHoverStyle, component._jsPlumb.paintStyle);
          jsPlumb2.extend(mergedHoverStyle, component._jsPlumb.hoverPaintStyle);
          delete component._jsPlumb.hoverPaintStyle;
          if (mergedHoverStyle.gradient && component._jsPlumb.paintStyle.fill) {
            delete mergedHoverStyle.gradient;
          }
          component._jsPlumb.hoverPaintStyle = mergedHoverStyle;
        }
      }, events = ["tap", "dbltap", "click", "dblclick", "mouseover", "mouseout", "mousemove", "mousedown", "mouseup", "contextmenu"], _updateAttachedElements = function(component, state, timestamp, sourceElement) {
        var affectedElements = component.getAttachedElements();
        if (affectedElements) {
          for (var i = 0, j = affectedElements.length; i < j; i++) {
            if (!sourceElement || sourceElement !== affectedElements[i]) {
              affectedElements[i].setHover(state, true, timestamp);
            }
          }
        }
      }, _splitType = function(t) {
        return t == null ? null : t.split(" ");
      }, _mapType = function(map, obj, typeId) {
        for (var i in obj) {
          map[i] = typeId;
        }
      }, _applyTypes = function(component, params, doNotRepaint) {
        if (component.getDefaultType) {
          var td = component.getTypeDescriptor(), map = {};
          var defType = component.getDefaultType();
          var o = _ju.merge({}, defType);
          _mapType(map, defType, "__default");
          for (var i = 0, j = component._jsPlumb.types.length; i < j; i++) {
            var tid = component._jsPlumb.types[i];
            if (tid !== "__default") {
              var _t = component._jsPlumb.instance.getType(tid, td);
              if (_t != null) {
                var overrides = ["anchor", "anchors", "connector", "paintStyle", "hoverPaintStyle", "endpoint", "endpoints", "connectorOverlays", "connectorStyle", "connectorHoverStyle", "endpointStyle", "endpointHoverStyle"];
                var collations = [];
                if (_t.mergeStrategy === "override") {
                  Array.prototype.push.apply(overrides, ["events", "overlays", "cssClass"]);
                } else {
                  collations.push("cssClass");
                }
                o = _ju.merge(o, _t, collations, overrides);
                _mapType(map, _t, tid);
              }
            }
          }
          if (params) {
            o = _ju.populate(o, params, "_");
          }
          component.applyType(o, doNotRepaint, map);
          if (!doNotRepaint) {
            component.repaint();
          }
        }
      }, jsPlumbUIComponent = root.jsPlumbUIComponent = function(params) {
        _ju.EventGenerator.apply(this, arguments);
        var self = this, a = arguments, idPrefix = self.idPrefix, id = idPrefix + (/* @__PURE__ */ new Date()).getTime();
        this._jsPlumb = {
          instance: params._jsPlumb,
          parameters: params.parameters || {},
          paintStyle: null,
          hoverPaintStyle: null,
          paintStyleInUse: null,
          hover: false,
          beforeDetach: params.beforeDetach,
          beforeDrop: params.beforeDrop,
          overlayPlacements: [],
          hoverClass: params.hoverClass || params._jsPlumb.Defaults.HoverClass,
          types: [],
          typeCache: {}
        };
        this.cacheTypeItem = function(key, item, typeId) {
          this._jsPlumb.typeCache[typeId] = this._jsPlumb.typeCache[typeId] || {};
          this._jsPlumb.typeCache[typeId][key] = item;
        };
        this.getCachedTypeItem = function(key, typeId) {
          return this._jsPlumb.typeCache[typeId] ? this._jsPlumb.typeCache[typeId][key] : null;
        };
        this.getId = function() {
          return id;
        };
        var o = params.overlays || [], oo = {};
        if (this.defaultOverlayKeys) {
          for (var i = 0; i < this.defaultOverlayKeys.length; i++) {
            Array.prototype.push.apply(o, this._jsPlumb.instance.Defaults[this.defaultOverlayKeys[i]] || []);
          }
          for (i = 0; i < o.length; i++) {
            var fo = jsPlumb2.convertToFullOverlaySpec(o[i]);
            oo[fo[1].id] = fo;
          }
        }
        var _defaultType = {
          overlays: oo,
          parameters: params.parameters || {},
          scope: params.scope || this._jsPlumb.instance.getDefaultScope()
        };
        this.getDefaultType = function() {
          return _defaultType;
        };
        this.appendToDefaultType = function(obj) {
          for (var i2 in obj) {
            _defaultType[i2] = obj[i2];
          }
        };
        if (params.events) {
          for (var evtName in params.events) {
            self.bind(evtName, params.events[evtName]);
          }
        }
        this.clone = (function() {
          var o2 = Object.create(this.constructor.prototype);
          this.constructor.apply(o2, a);
          return o2;
        }).bind(this);
        this.isDetachAllowed = function(connection) {
          var r = true;
          if (this._jsPlumb.beforeDetach) {
            try {
              r = this._jsPlumb.beforeDetach(connection);
            } catch (e) {
              _ju.log("jsPlumb: beforeDetach callback failed", e);
            }
          }
          return r;
        };
        this.isDropAllowed = function(sourceId, targetId, scope, connection, dropEndpoint, source, target) {
          var r = this._jsPlumb.instance.checkCondition("beforeDrop", {
            sourceId,
            targetId,
            scope,
            connection,
            dropEndpoint,
            source,
            target
          });
          if (this._jsPlumb.beforeDrop) {
            try {
              r = this._jsPlumb.beforeDrop({
                sourceId,
                targetId,
                scope,
                connection,
                dropEndpoint,
                source,
                target
              });
            } catch (e) {
              _ju.log("jsPlumb: beforeDrop callback failed", e);
            }
          }
          return r;
        };
        var domListeners = [];
        this.setListenerComponent = function(c) {
          for (var i2 = 0; i2 < domListeners.length; i2++) {
            domListeners[i2][3] = c;
          }
        };
      };
      var _removeTypeCssHelper = function(component, typeIndex) {
        var typeId = component._jsPlumb.types[typeIndex], type = component._jsPlumb.instance.getType(typeId, component.getTypeDescriptor());
        if (type != null && type.cssClass && component.canvas) {
          component._jsPlumb.instance.removeClass(component.canvas, type.cssClass);
        }
      };
      _ju.extend(root.jsPlumbUIComponent, _ju.EventGenerator, {
        getParameter: function(name) {
          return this._jsPlumb.parameters[name];
        },
        setParameter: function(name, value) {
          this._jsPlumb.parameters[name] = value;
        },
        getParameters: function() {
          return this._jsPlumb.parameters;
        },
        setParameters: function(p) {
          this._jsPlumb.parameters = p;
        },
        getClass: function() {
          return jsPlumb2.getClass(this.canvas);
        },
        hasClass: function(clazz) {
          return jsPlumb2.hasClass(this.canvas, clazz);
        },
        addClass: function(clazz) {
          jsPlumb2.addClass(this.canvas, clazz);
        },
        removeClass: function(clazz) {
          jsPlumb2.removeClass(this.canvas, clazz);
        },
        updateClasses: function(classesToAdd, classesToRemove) {
          jsPlumb2.updateClasses(this.canvas, classesToAdd, classesToRemove);
        },
        setType: function(typeId, params, doNotRepaint) {
          this.clearTypes();
          this._jsPlumb.types = _splitType(typeId) || [];
          _applyTypes(this, params, doNotRepaint);
        },
        getType: function() {
          return this._jsPlumb.types;
        },
        reapplyTypes: function(params, doNotRepaint) {
          _applyTypes(this, params, doNotRepaint);
        },
        hasType: function(typeId) {
          return this._jsPlumb.types.indexOf(typeId) !== -1;
        },
        addType: function(typeId, params, doNotRepaint) {
          var t = _splitType(typeId), _cont = false;
          if (t != null) {
            for (var i = 0, j = t.length; i < j; i++) {
              if (!this.hasType(t[i])) {
                this._jsPlumb.types.push(t[i]);
                _cont = true;
              }
            }
            if (_cont) {
              _applyTypes(this, params, doNotRepaint);
            }
          }
        },
        removeType: function(typeId, params, doNotRepaint) {
          var t = _splitType(typeId), _cont = false, _one = (function(tt) {
            var idx = this._jsPlumb.types.indexOf(tt);
            if (idx !== -1) {
              _removeTypeCssHelper(this, idx);
              this._jsPlumb.types.splice(idx, 1);
              return true;
            }
            return false;
          }).bind(this);
          if (t != null) {
            for (var i = 0, j = t.length; i < j; i++) {
              _cont = _one(t[i]) || _cont;
            }
            if (_cont) {
              _applyTypes(this, params, doNotRepaint);
            }
          }
        },
        clearTypes: function(params, doNotRepaint) {
          var i = this._jsPlumb.types.length;
          for (var j = 0; j < i; j++) {
            _removeTypeCssHelper(this, 0);
            this._jsPlumb.types.splice(0, 1);
          }
          _applyTypes(this, params, doNotRepaint);
        },
        toggleType: function(typeId, params, doNotRepaint) {
          var t = _splitType(typeId);
          if (t != null) {
            for (var i = 0, j = t.length; i < j; i++) {
              var idx = this._jsPlumb.types.indexOf(t[i]);
              if (idx !== -1) {
                _removeTypeCssHelper(this, idx);
                this._jsPlumb.types.splice(idx, 1);
              } else {
                this._jsPlumb.types.push(t[i]);
              }
            }
            _applyTypes(this, params, doNotRepaint);
          }
        },
        applyType: function(t, doNotRepaint) {
          this.setPaintStyle(t.paintStyle, doNotRepaint);
          this.setHoverPaintStyle(t.hoverPaintStyle, doNotRepaint);
          if (t.parameters) {
            for (var i in t.parameters) {
              this.setParameter(i, t.parameters[i]);
            }
          }
          this._jsPlumb.paintStyleInUse = this.getPaintStyle();
        },
        setPaintStyle: function(style, doNotRepaint) {
          this._jsPlumb.paintStyle = style;
          this._jsPlumb.paintStyleInUse = this._jsPlumb.paintStyle;
          _updateHoverStyle(this);
          if (!doNotRepaint) {
            this.repaint();
          }
        },
        getPaintStyle: function() {
          return this._jsPlumb.paintStyle;
        },
        setHoverPaintStyle: function(style, doNotRepaint) {
          this._jsPlumb.hoverPaintStyle = style;
          _updateHoverStyle(this);
          if (!doNotRepaint) {
            this.repaint();
          }
        },
        getHoverPaintStyle: function() {
          return this._jsPlumb.hoverPaintStyle;
        },
        destroy: function(force) {
          if (force || this.typeId == null) {
            this.cleanupListeners();
            this.clone = null;
            this._jsPlumb = null;
          }
        },
        isHover: function() {
          return this._jsPlumb.hover;
        },
        setHover: function(hover, ignoreAttachedElements, timestamp) {
          if (this._jsPlumb && !this._jsPlumb.instance.currentlyDragging && !this._jsPlumb.instance.isHoverSuspended()) {
            this._jsPlumb.hover = hover;
            var method = hover ? "addClass" : "removeClass";
            if (this.canvas != null) {
              if (this._jsPlumb.instance.hoverClass != null) {
                this._jsPlumb.instance[method](this.canvas, this._jsPlumb.instance.hoverClass);
              }
              if (this._jsPlumb.hoverClass != null) {
                this._jsPlumb.instance[method](this.canvas, this._jsPlumb.hoverClass);
              }
            }
            if (this._jsPlumb.hoverPaintStyle != null) {
              this._jsPlumb.paintStyleInUse = hover ? this._jsPlumb.hoverPaintStyle : this._jsPlumb.paintStyle;
              if (!this._jsPlumb.instance.isSuspendDrawing()) {
                timestamp = timestamp || jsPlumbUtil.uuid();
                this.repaint({ timestamp, recalc: false });
              }
            }
            if (this.getAttachedElements && !ignoreAttachedElements) {
              _updateAttachedElements(this, hover, jsPlumbUtil.uuid(), this);
            }
          }
        }
      });
      var _jsPlumbInstanceIndex = 0, getInstanceIndex = function() {
        var i = _jsPlumbInstanceIndex + 1;
        _jsPlumbInstanceIndex++;
        return i;
      };
      var jsPlumbInstance = root.jsPlumbInstance = function(_defaults) {
        this.version = "2.15.6";
        this.Defaults = {
          Anchor: "Bottom",
          Anchors: [null, null],
          ConnectionsDetachable: true,
          ConnectionOverlays: [],
          Connector: "Bezier",
          Container: null,
          DoNotThrowErrors: false,
          DragOptions: {},
          DropOptions: {},
          Endpoint: "Dot",
          EndpointOverlays: [],
          Endpoints: [null, null],
          EndpointStyle: { fill: "#456" },
          EndpointStyles: [null, null],
          EndpointHoverStyle: null,
          EndpointHoverStyles: [null, null],
          HoverPaintStyle: null,
          LabelStyle: { color: "black" },
          ListStyle: {},
          LogEnabled: false,
          Overlays: [],
          MaxConnections: 1,
          PaintStyle: { "stroke-width": 4, stroke: "#456" },
          ReattachConnections: false,
          RenderMode: "svg",
          Scope: "jsPlumb_DefaultScope"
        };
        if (_defaults) {
          jsPlumb2.extend(this.Defaults, _defaults);
        }
        this.logEnabled = this.Defaults.LogEnabled;
        this._connectionTypes = {};
        this._endpointTypes = {};
        _ju.EventGenerator.apply(this);
        var _currentInstance = this, _instanceIndex = getInstanceIndex(), _bb = _currentInstance.bind, _initialDefaults = {}, _zoom = 1, _info = function(el) {
          if (el == null) {
            return null;
          } else if (el.nodeType === 3 || el.nodeType === 8) {
            return { el, text: true };
          } else {
            var _el = _currentInstance.getElement(el);
            return { el: _el, id: _ju.isString(el) && _el == null ? el : _getId(_el) };
          }
        };
        this.getInstanceIndex = function() {
          return _instanceIndex;
        };
        this.setZoom = function(z, repaintEverything) {
          _zoom = z;
          _currentInstance.fire("zoom", _zoom);
          if (repaintEverything) {
            _currentInstance.repaintEverything();
          }
          return true;
        };
        this.getZoom = function() {
          return _zoom;
        };
        for (var i in this.Defaults) {
          _initialDefaults[i] = this.Defaults[i];
        }
        var _container, _containerDelegations = [];
        this.unbindContainer = function() {
          if (_container != null && _containerDelegations.length > 0) {
            for (var i2 = 0; i2 < _containerDelegations.length; i2++) {
              _currentInstance.off(_container, _containerDelegations[i2][0], _containerDelegations[i2][1]);
            }
          }
        };
        this.setContainer = function(c) {
          this.unbindContainer();
          c = this.getElement(c);
          this.select().each(function(conn) {
            conn.moveParent(c);
          });
          this.selectEndpoints().each(function(ep) {
            ep.moveParent(c);
          });
          var previousContainer = _container;
          _container = c;
          _containerDelegations.length = 0;
          var eventAliases = {
            "endpointclick": "endpointClick",
            "endpointdblclick": "endpointDblClick"
          };
          var _oneDelegateHandler = function(id, e, componentType) {
            var t = e.srcElement || e.target, jp = (t && t.parentNode ? t.parentNode._jsPlumb : null) || (t ? t._jsPlumb : null) || (t && t.parentNode && t.parentNode.parentNode ? t.parentNode.parentNode._jsPlumb : null);
            if (jp) {
              jp.fire(id, jp, e);
              var alias = componentType ? eventAliases[componentType + id] || id : id;
              _currentInstance.fire(alias, jp.component || jp, e);
            }
          };
          var _addOneDelegate = function(eventId, selector, fn) {
            _containerDelegations.push([eventId, fn]);
            _currentInstance.on(_container, eventId, selector, fn);
          };
          var _oneDelegate = function(id) {
            _addOneDelegate(id, ".jtk-connector", function(e) {
              _oneDelegateHandler(id, e);
            });
            _addOneDelegate(id, ".jtk-endpoint", function(e) {
              _oneDelegateHandler(id, e, "endpoint");
            });
            _addOneDelegate(id, ".jtk-overlay", function(e) {
              _oneDelegateHandler(id, e);
            });
          };
          for (var i2 = 0; i2 < events.length; i2++) {
            _oneDelegate(events[i2]);
          }
          for (var elId in managedElements) {
            var el = managedElements[elId].el;
            if (el.parentNode === previousContainer) {
              previousContainer.removeChild(el);
              _container.appendChild(el);
            }
          }
        };
        this.getContainer = function() {
          return _container;
        };
        this.bind = function(event, fn) {
          if ("ready" === event && initialized) {
            fn();
          } else {
            _bb.apply(_currentInstance, [event, fn]);
          }
        };
        _currentInstance.importDefaults = function(d) {
          for (var i2 in d) {
            _currentInstance.Defaults[i2] = d[i2];
          }
          if (d.Container) {
            _currentInstance.setContainer(d.Container);
          }
          return _currentInstance;
        };
        _currentInstance.restoreDefaults = function() {
          _currentInstance.Defaults = jsPlumb2.extend({}, _initialDefaults);
          return _currentInstance;
        };
        var log = null, initialized = false, connections = [], endpointsByElement = {}, endpointsByUUID = {}, managedElements = {}, offsets = {}, offsetTimestamps = {}, connectionBeingDragged = false, sizes = [], _suspendDrawing = false, _suspendedAt = null, DEFAULT_SCOPE = this.Defaults.Scope, _curIdStamp = 1, _idstamp = function() {
          return "" + _curIdStamp++;
        }, _appendElement = (function(el, parent) {
          if (_container) {
            _container.appendChild(el);
          } else if (!parent) {
            this.appendToRoot(el);
          } else {
            this.getElement(parent).appendChild(el);
          }
        }).bind(this), _draw = function(element, ui, timestamp, clearEdits) {
          var drawResult = { c: [], e: [] };
          if (!_suspendDrawing) {
            element = _currentInstance.getElement(element);
            if (element != null) {
              var id = _getId(element), repaintEls = element.querySelectorAll(".jtk-managed");
              if (timestamp == null) {
                timestamp = jsPlumbUtil.uuid();
              }
              _updateOffset({ elId: id, offset: ui, recalc: false, timestamp });
              for (var i2 = 0; i2 < repaintEls.length; i2++) {
                _updateOffset({
                  elId: repaintEls[i2].getAttribute("id"),
                  // offset: {
                  //     left: o.o.left + repaintEls[i].offset.left,
                  //     top: o.o.top + repaintEls[i].offset.top
                  // },
                  recalc: true,
                  timestamp
                });
              }
              var d2 = _currentInstance.router.redraw(id, ui, timestamp, null, clearEdits);
              Array.prototype.push.apply(drawResult.c, d2.c);
              Array.prototype.push.apply(drawResult.e, d2.e);
              if (repaintEls) {
                for (var j = 0; j < repaintEls.length; j++) {
                  d2 = _currentInstance.router.redraw(repaintEls[j].getAttribute("id"), null, timestamp, null, clearEdits, true);
                  Array.prototype.push.apply(drawResult.c, d2.c);
                  Array.prototype.push.apply(drawResult.e, d2.e);
                }
              }
            }
          }
          return drawResult;
        }, _getEndpoint = function(uuid) {
          return endpointsByUUID[uuid];
        }, _scopeMatch = function(e1, e2) {
          var s1 = e1.scope.split(/\s/), s2 = e2.scope.split(/\s/);
          for (var i2 = 0; i2 < s1.length; i2++) {
            for (var j = 0; j < s2.length; j++) {
              if (s2[j] === s1[i2]) {
                return true;
              }
            }
          }
          return false;
        }, _mergeOverrides = function(def, values) {
          var m = jsPlumb2.extend({}, def);
          for (var i2 in values) {
            if (values[i2]) {
              m[i2] = values[i2];
            }
          }
          return m;
        }, _prepareConnectionParams = (function(params, referenceParams) {
          var _p = jsPlumb2.extend({}, params);
          if (referenceParams) {
            jsPlumb2.extend(_p, referenceParams);
          }
          if (_p.source) {
            if (_p.source.endpoint) {
              _p.sourceEndpoint = _p.source;
            } else {
              _p.source = _currentInstance.getElement(_p.source);
            }
          }
          if (_p.target) {
            if (_p.target.endpoint) {
              _p.targetEndpoint = _p.target;
            } else {
              _p.target = _currentInstance.getElement(_p.target);
            }
          }
          if (params.uuids) {
            _p.sourceEndpoint = _getEndpoint(params.uuids[0]);
            _p.targetEndpoint = _getEndpoint(params.uuids[1]);
          }
          if (_p.sourceEndpoint && _p.sourceEndpoint.isFull()) {
            _ju.log(_currentInstance, "could not add connection; source endpoint is full");
            return;
          }
          if (_p.targetEndpoint && _p.targetEndpoint.isFull()) {
            _ju.log(_currentInstance, "could not add connection; target endpoint is full");
            return;
          }
          if (!_p.type && _p.sourceEndpoint) {
            _p.type = _p.sourceEndpoint.connectionType;
          }
          if (_p.sourceEndpoint && _p.sourceEndpoint.connectorOverlays) {
            _p.overlays = _p.overlays || [];
            for (var i2 = 0, j = _p.sourceEndpoint.connectorOverlays.length; i2 < j; i2++) {
              _p.overlays.push(_p.sourceEndpoint.connectorOverlays[i2]);
            }
          }
          if (_p.sourceEndpoint && _p.sourceEndpoint.scope) {
            _p.scope = _p.sourceEndpoint.scope;
          }
          if (!_p["pointer-events"] && _p.sourceEndpoint && _p.sourceEndpoint.connectorPointerEvents) {
            _p["pointer-events"] = _p.sourceEndpoint.connectorPointerEvents;
          }
          var _addEndpoint = function(el, def, idx) {
            var params2 = _mergeOverrides(def, {
              anchor: _p.anchors ? _p.anchors[idx] : _p.anchor,
              endpoint: _p.endpoints ? _p.endpoints[idx] : _p.endpoint,
              paintStyle: _p.endpointStyles ? _p.endpointStyles[idx] : _p.endpointStyle,
              hoverPaintStyle: _p.endpointHoverStyles ? _p.endpointHoverStyles[idx] : _p.endpointHoverStyle
            });
            return _currentInstance.addEndpoint(el, params2);
          };
          var _oneElementDef = function(type, idx, defs, matchType) {
            if (_p[type] && !_p[type].endpoint && !_p[type + "Endpoint"] && !_p.newConnection) {
              var tid = _getId(_p[type]), tep = defs[tid];
              tep = tep ? tep[matchType] : null;
              if (tep) {
                if (!tep.enabled) {
                  return false;
                }
                var epDef = jsPlumb2.extend({}, tep.def);
                delete epDef.label;
                var newEndpoint = tep.endpoint != null && tep.endpoint._jsPlumb ? tep.endpoint : _addEndpoint(_p[type], epDef, idx);
                if (newEndpoint.isFull()) {
                  return false;
                }
                _p[type + "Endpoint"] = newEndpoint;
                if (!_p.scope && epDef.scope) {
                  _p.scope = epDef.scope;
                }
                if (tep.uniqueEndpoint) {
                  if (!tep.endpoint) {
                    tep.endpoint = newEndpoint;
                    newEndpoint.setDeleteOnEmpty(false);
                  } else {
                    newEndpoint.finalEndpoint = tep.endpoint;
                  }
                } else {
                  newEndpoint.setDeleteOnEmpty(true);
                }
                if (idx === 0 && tep.def.connectorOverlays) {
                  _p.overlays = _p.overlays || [];
                  Array.prototype.push.apply(_p.overlays, tep.def.connectorOverlays);
                }
              }
            }
          };
          if (_oneElementDef("source", 0, this.sourceEndpointDefinitions, _p.type || "default") === false) {
            return;
          }
          if (_oneElementDef("target", 1, this.targetEndpointDefinitions, _p.type || "default") === false) {
            return;
          }
          if (_p.sourceEndpoint && _p.targetEndpoint) {
            if (!_scopeMatch(_p.sourceEndpoint, _p.targetEndpoint)) {
              _p = null;
            }
          }
          return _p;
        }).bind(_currentInstance), _newConnection = function(params) {
          var connectionFunc = _currentInstance.Defaults.ConnectionType || _currentInstance.getDefaultConnectionType();
          params._jsPlumb = _currentInstance;
          params.newConnection = _newConnection;
          params.newEndpoint = _newEndpoint;
          params.endpointsByUUID = endpointsByUUID;
          params.endpointsByElement = endpointsByElement;
          params.finaliseConnection = _finaliseConnection;
          params.id = "con_" + _idstamp();
          var con = new connectionFunc(params);
          if (con.isDetachable()) {
            con.endpoints[0].initDraggable("_jsPlumbSource");
            con.endpoints[1].initDraggable("_jsPlumbTarget");
          }
          return con;
        }, _finaliseConnection = _currentInstance.finaliseConnection = function(jpc, params, originalEvent, doInformAnchorManager) {
          params = params || {};
          if (!jpc.suspendedEndpoint) {
            connections.push(jpc);
          }
          jpc.pending = null;
          jpc.endpoints[0].isTemporarySource = false;
          if (doInformAnchorManager !== false) {
            _currentInstance.router.newConnection(jpc);
          }
          _draw(jpc.source);
          if (!params.doNotFireConnectionEvent && params.fireEvent !== false) {
            var eventArgs = {
              connection: jpc,
              source: jpc.source,
              target: jpc.target,
              sourceId: jpc.sourceId,
              targetId: jpc.targetId,
              sourceEndpoint: jpc.endpoints[0],
              targetEndpoint: jpc.endpoints[1]
            };
            _currentInstance.fire("connection", eventArgs, originalEvent);
          }
        }, _newEndpoint = function(params, id) {
          var endpointFunc = _currentInstance.Defaults.EndpointType || jsPlumb2.Endpoint;
          var _p = jsPlumb2.extend({}, params);
          _p._jsPlumb = _currentInstance;
          _p.newConnection = _newConnection;
          _p.newEndpoint = _newEndpoint;
          _p.endpointsByUUID = endpointsByUUID;
          _p.endpointsByElement = endpointsByElement;
          _p.fireDetachEvent = fireDetachEvent;
          _p.elementId = id || _getId(_p.source);
          var ep = new endpointFunc(_p);
          ep.id = "ep_" + _idstamp();
          _manage(_p.elementId, _p.source);
          if (!jsPlumb2.headless) {
            _currentInstance.getDragManager().endpointAdded(_p.source, id);
          }
          return ep;
        }, _operation = function(elId, func, endpointFunc) {
          var endpoints = endpointsByElement[elId];
          if (endpoints && endpoints.length) {
            for (var i2 = 0, ii = endpoints.length; i2 < ii; i2++) {
              for (var j = 0, jj = endpoints[i2].connections.length; j < jj; j++) {
                var retVal = func(endpoints[i2].connections[j]);
                if (retVal) {
                  return;
                }
              }
              if (endpointFunc) {
                endpointFunc(endpoints[i2]);
              }
            }
          }
        }, _setVisible = function(el, state, alsoChangeEndpoints) {
          state = state === "block";
          var endpointFunc = null;
          if (alsoChangeEndpoints) {
            endpointFunc = function(ep) {
              ep.setVisible(state, true, true);
            };
          }
          var info = _info(el);
          _operation(info.id, function(jpc) {
            if (state && alsoChangeEndpoints) {
              var oidx = jpc.sourceId === info.id ? 1 : 0;
              if (jpc.endpoints[oidx].isVisible()) {
                jpc.setVisible(true);
              }
            } else {
              jpc.setVisible(state);
            }
          }, endpointFunc);
        }, _toggleVisible = function(elId, changeEndpoints) {
          var endpointFunc = null;
          if (changeEndpoints) {
            endpointFunc = function(ep) {
              var state = ep.isVisible();
              ep.setVisible(!state);
            };
          }
          _operation(elId, function(jpc) {
            var state = jpc.isVisible();
            jpc.setVisible(!state);
          }, endpointFunc);
        }, _getCachedData = function(elId) {
          var o = offsets[elId];
          if (!o) {
            return _updateOffset({ elId });
          } else {
            return { o, s: sizes[elId] };
          }
        }, _getId = function(element, uuid, doNotCreateIfNotFound) {
          if (_ju.isString(element)) {
            return element;
          }
          if (element == null) {
            return null;
          }
          var id = _currentInstance.getAttribute(element, "id");
          if (!id || id === "undefined") {
            if (arguments.length === 2 && arguments[1] !== void 0) {
              id = uuid;
            } else if (arguments.length === 1 || arguments.length === 3 && !arguments[2]) {
              id = "jsPlumb_" + _instanceIndex + "_" + _idstamp();
            }
            if (!doNotCreateIfNotFound) {
              _currentInstance.setAttribute(element, "id", id);
            }
          }
          return id;
        };
        this.setConnectionBeingDragged = function(v) {
          connectionBeingDragged = v;
        };
        this.isConnectionBeingDragged = function() {
          return connectionBeingDragged;
        };
        this.getManagedElements = function() {
          return managedElements;
        };
        this.connectorClass = "jtk-connector";
        this.connectorOutlineClass = "jtk-connector-outline";
        this.connectedClass = "jtk-connected";
        this.hoverClass = "jtk-hover";
        this.endpointClass = "jtk-endpoint";
        this.endpointConnectedClass = "jtk-endpoint-connected";
        this.endpointFullClass = "jtk-endpoint-full";
        this.endpointDropAllowedClass = "jtk-endpoint-drop-allowed";
        this.endpointDropForbiddenClass = "jtk-endpoint-drop-forbidden";
        this.overlayClass = "jtk-overlay";
        this.draggingClass = "jtk-dragging";
        this.elementDraggingClass = "jtk-element-dragging";
        this.sourceElementDraggingClass = "jtk-source-element-dragging";
        this.targetElementDraggingClass = "jtk-target-element-dragging";
        this.endpointAnchorClassPrefix = "jtk-endpoint-anchor";
        this.hoverSourceClass = "jtk-source-hover";
        this.hoverTargetClass = "jtk-target-hover";
        this.dragSelectClass = "jtk-drag-select";
        this.Anchors = {};
        this.Connectors = { "svg": {} };
        this.Endpoints = { "svg": {} };
        this.Overlays = { "svg": {} };
        this.ConnectorRenderers = {};
        this.SVG = "svg";
        this.addEndpoint = function(el, params, referenceParams) {
          referenceParams = referenceParams || {};
          var p = jsPlumb2.extend({}, referenceParams);
          jsPlumb2.extend(p, params);
          p.endpoint = p.endpoint || _currentInstance.Defaults.Endpoint;
          p.paintStyle = p.paintStyle || _currentInstance.Defaults.EndpointStyle;
          var results = [], inputs = _ju.isArray(el) || el.length != null && !_ju.isString(el) ? el : [el];
          for (var i2 = 0, j = inputs.length; i2 < j; i2++) {
            p.source = _currentInstance.getElement(inputs[i2]);
            _ensureContainer(p.source);
            var id = _getId(p.source), e = _newEndpoint(p, id);
            var myOffset = _manage(id, p.source, null, !_suspendDrawing).info.o;
            _ju.addToList(endpointsByElement, id, e);
            if (!_suspendDrawing) {
              e.paint({
                anchorLoc: e.anchor.compute(
                  {
                    xy: [myOffset.left, myOffset.top],
                    wh: sizes[id],
                    element: e,
                    timestamp: _suspendedAt,
                    rotation: this.getRotation(id)
                  }
                ),
                timestamp: _suspendedAt
              });
            }
            results.push(e);
          }
          return results.length === 1 ? results[0] : results;
        };
        this.addEndpoints = function(el, endpoints, referenceParams) {
          var results = [];
          for (var i2 = 0, j = endpoints.length; i2 < j; i2++) {
            var e = _currentInstance.addEndpoint(el, endpoints[i2], referenceParams);
            if (_ju.isArray(e)) {
              Array.prototype.push.apply(results, e);
            } else {
              results.push(e);
            }
          }
          return results;
        };
        this.animate = function(el, properties, options) {
          if (!this.animationSupported) {
            return false;
          }
          options = options || {};
          var del = _currentInstance.getElement(el), id = _getId(del), stepFunction = jsPlumb2.animEvents.step, completeFunction = jsPlumb2.animEvents.complete;
          options[stepFunction] = _ju.wrap(options[stepFunction], function() {
            _currentInstance.revalidate(id);
          });
          options[completeFunction] = _ju.wrap(options[completeFunction], function() {
            _currentInstance.revalidate(id);
          });
          _currentInstance.doAnimate(del, properties, options);
        };
        this.checkCondition = function(conditionName, args) {
          var l = _currentInstance.getListener(conditionName), r = true;
          if (l && l.length > 0) {
            var values = Array.prototype.slice.call(arguments, 1);
            try {
              for (var i2 = 0, j = l.length; i2 < j; i2++) {
                r = r && l[i2].apply(l[i2], values);
              }
            } catch (e) {
              _ju.log(_currentInstance, "cannot check condition [" + conditionName + "]" + e);
            }
          }
          return r;
        };
        this.connect = function(params, referenceParams) {
          var _p = _prepareConnectionParams(params, referenceParams), jpc;
          if (_p) {
            if (_p.source == null && _p.sourceEndpoint == null) {
              _ju.log("Cannot establish connection - source does not exist");
              return;
            }
            if (_p.target == null && _p.targetEndpoint == null) {
              _ju.log("Cannot establish connection - target does not exist");
              return;
            }
            _ensureContainer(_p.source);
            jpc = _newConnection(_p);
            _finaliseConnection(jpc, _p);
          }
          return jpc;
        };
        var stTypes = [
          { el: "source", elId: "sourceId", epDefs: "sourceEndpointDefinitions" },
          { el: "target", elId: "targetId", epDefs: "targetEndpointDefinitions" }
        ];
        var _set = (function(c, el, idx, doNotRepaint) {
          var ep, _st = stTypes[idx], cId = c[_st.elId];
          c[_st.el];
          var sid, sep, oldEndpoint = c.endpoints[idx];
          var evtParams = {
            index: idx,
            originalSourceId: idx === 0 ? cId : c.sourceId,
            newSourceId: c.sourceId,
            originalTargetId: idx === 1 ? cId : c.targetId,
            newTargetId: c.targetId,
            connection: c
          };
          if (el.constructor === jsPlumb2.Endpoint) {
            ep = el;
            ep.addConnection(c);
            el = ep.element;
          } else {
            sid = _getId(el);
            sep = this[_st.epDefs][sid];
            if (sid === c[_st.elId]) {
              ep = null;
            } else if (sep) {
              for (var t in sep) {
                if (!sep[t].enabled) {
                  return;
                }
                ep = sep[t].endpoint != null && sep[t].endpoint._jsPlumb ? sep[t].endpoint : this.addEndpoint(el, sep[t].def);
                if (sep[t].uniqueEndpoint) {
                  sep[t].endpoint = ep;
                }
                ep.addConnection(c);
              }
            } else {
              ep = c.makeEndpoint(idx === 0, el, sid);
            }
          }
          if (ep != null) {
            oldEndpoint.detachFromConnection(c);
            c.endpoints[idx] = ep;
            c[_st.el] = ep.element;
            c[_st.elId] = ep.elementId;
            evtParams[idx === 0 ? "newSourceId" : "newTargetId"] = ep.elementId;
            fireMoveEvent(evtParams);
            if (!doNotRepaint) {
              c.repaint();
            }
          }
          evtParams.element = el;
          return evtParams;
        }).bind(this);
        this.setSource = function(connection, el, doNotRepaint) {
          var p = _set(connection, el, 0, doNotRepaint);
          this.router.sourceOrTargetChanged(p.originalSourceId, p.newSourceId, connection, p.el, 0);
        };
        this.setTarget = function(connection, el, doNotRepaint) {
          var p = _set(connection, el, 1, doNotRepaint);
          this.router.sourceOrTargetChanged(p.originalTargetId, p.newTargetId, connection, p.el, 1);
        };
        this.deleteEndpoint = function(object, dontUpdateHover, deleteAttachedObjects) {
          var endpoint = typeof object === "string" ? endpointsByUUID[object] : object;
          if (endpoint) {
            _currentInstance.deleteObject({ endpoint, dontUpdateHover, deleteAttachedObjects });
          }
          return _currentInstance;
        };
        this.deleteEveryEndpoint = function() {
          var _is = _currentInstance.setSuspendDrawing(true);
          for (var id in endpointsByElement) {
            var endpoints = endpointsByElement[id];
            if (endpoints && endpoints.length) {
              for (var i2 = 0, j = endpoints.length; i2 < j; i2++) {
                _currentInstance.deleteEndpoint(endpoints[i2], true);
              }
            }
          }
          endpointsByElement = {};
          managedElements = {};
          endpointsByUUID = {};
          offsets = {};
          offsetTimestamps = {};
          _currentInstance.router.reset();
          var dm = _currentInstance.getDragManager();
          if (dm) {
            dm.reset();
          }
          if (!_is) {
            _currentInstance.setSuspendDrawing(false);
          }
          return _currentInstance;
        };
        var fireDetachEvent = function(jpc, doFireEvent, originalEvent) {
          var connType = _currentInstance.Defaults.ConnectionType || _currentInstance.getDefaultConnectionType(), argIsConnection = jpc.constructor === connType, params = argIsConnection ? {
            connection: jpc,
            source: jpc.source,
            target: jpc.target,
            sourceId: jpc.sourceId,
            targetId: jpc.targetId,
            sourceEndpoint: jpc.endpoints[0],
            targetEndpoint: jpc.endpoints[1]
          } : jpc;
          if (doFireEvent) {
            _currentInstance.fire("connectionDetached", params, originalEvent);
          }
          _currentInstance.fire("internal.connectionDetached", params, originalEvent);
          _currentInstance.router.connectionDetached(params);
        };
        var fireMoveEvent = _currentInstance.fireMoveEvent = function(params, evt) {
          _currentInstance.fire("connectionMoved", params, evt);
        };
        this.unregisterEndpoint = function(endpoint) {
          if (endpoint._jsPlumb.uuid) {
            endpointsByUUID[endpoint._jsPlumb.uuid] = null;
          }
          _currentInstance.router.deleteEndpoint(endpoint);
          for (var e in endpointsByElement) {
            var endpoints = endpointsByElement[e];
            if (endpoints) {
              var newEndpoints = [];
              for (var i2 = 0, j = endpoints.length; i2 < j; i2++) {
                if (endpoints[i2] !== endpoint) {
                  newEndpoints.push(endpoints[i2]);
                }
              }
              endpointsByElement[e] = newEndpoints;
            }
            if (endpointsByElement[e].length < 1) {
              delete endpointsByElement[e];
            }
          }
        };
        var IS_DETACH_ALLOWED = "isDetachAllowed";
        var BEFORE_DETACH = "beforeDetach";
        var CHECK_CONDITION = "checkCondition";
        this.deleteConnection = function(connection, params) {
          if (connection != null) {
            params = params || {};
            if (params.force || _ju.functionChain(true, false, [
              [connection.endpoints[0], IS_DETACH_ALLOWED, [connection]],
              [connection.endpoints[1], IS_DETACH_ALLOWED, [connection]],
              [connection, IS_DETACH_ALLOWED, [connection]],
              [_currentInstance, CHECK_CONDITION, [BEFORE_DETACH, connection]]
            ])) {
              connection.setHover(false);
              fireDetachEvent(connection, !connection.pending && params.fireEvent !== false, params.originalEvent);
              connection.endpoints[0].detachFromConnection(connection);
              connection.endpoints[1].detachFromConnection(connection);
              _ju.removeWithFunction(connections, function(_c) {
                return connection.id === _c.id;
              });
              connection.cleanup();
              connection.destroy();
              return true;
            }
          }
          return false;
        };
        this.deleteEveryConnection = function(params) {
          params = params || {};
          var count = connections.length, deletedCount = 0;
          _currentInstance.batch(function() {
            for (var i2 = 0; i2 < count; i2++) {
              deletedCount += _currentInstance.deleteConnection(connections[0], params) ? 1 : 0;
            }
          });
          return deletedCount;
        };
        this.deleteConnectionsForElement = function(el, params) {
          params = params || {};
          el = _currentInstance.getElement(el);
          var id = _getId(el), endpoints = endpointsByElement[id];
          if (endpoints && endpoints.length) {
            for (var i2 = 0, j = endpoints.length; i2 < j; i2++) {
              endpoints[i2].deleteEveryConnection(params);
            }
          }
          return _currentInstance;
        };
        this.deleteObject = function(params) {
          var result = {
            endpoints: {},
            connections: {},
            endpointCount: 0,
            connectionCount: 0
          }, deleteAttachedObjects = params.deleteAttachedObjects !== false;
          var unravelConnection = function(connection) {
            if (connection != null && result.connections[connection.id] == null) {
              if (!params.dontUpdateHover && connection._jsPlumb != null) {
                connection.setHover(false);
              }
              result.connections[connection.id] = connection;
              result.connectionCount++;
            }
          };
          var unravelEndpoint = function(endpoint) {
            if (endpoint != null && result.endpoints[endpoint.id] == null) {
              if (!params.dontUpdateHover && endpoint._jsPlumb != null) {
                endpoint.setHover(false);
              }
              result.endpoints[endpoint.id] = endpoint;
              result.endpointCount++;
              if (deleteAttachedObjects) {
                for (var i3 = 0; i3 < endpoint.connections.length; i3++) {
                  var c2 = endpoint.connections[i3];
                  unravelConnection(c2);
                }
              }
            }
          };
          if (params.connection) {
            unravelConnection(params.connection);
          } else {
            unravelEndpoint(params.endpoint);
          }
          for (var i2 in result.connections) {
            var c = result.connections[i2];
            if (c._jsPlumb) {
              _ju.removeWithFunction(connections, function(_c) {
                return c.id === _c.id;
              });
              fireDetachEvent(c, params.fireEvent === false ? false : !c.pending, params.originalEvent);
              var doNotCleanup = params.deleteAttachedObjects == null ? null : !params.deleteAttachedObjects;
              c.endpoints[0].detachFromConnection(c, null, doNotCleanup);
              c.endpoints[1].detachFromConnection(c, null, doNotCleanup);
              c.cleanup(true);
              c.destroy(true);
            }
          }
          for (var j in result.endpoints) {
            var e = result.endpoints[j];
            if (e._jsPlumb) {
              _currentInstance.unregisterEndpoint(e);
              e.cleanup(true);
              e.destroy(true);
            }
          }
          return result;
        };
        var _setOperation = function(list, func, args, selector) {
          for (var i2 = 0, j = list.length; i2 < j; i2++) {
            list[i2][func].apply(list[i2], args);
          }
          return selector(list);
        }, _getOperation = function(list, func, args) {
          var out = [];
          for (var i2 = 0, j = list.length; i2 < j; i2++) {
            out.push([list[i2][func].apply(list[i2], args), list[i2]]);
          }
          return out;
        }, setter = function(list, func, selector) {
          return function() {
            return _setOperation(list, func, arguments, selector);
          };
        }, getter = function(list, func) {
          return function() {
            return _getOperation(list, func, arguments);
          };
        }, prepareList = function(input, doNotGetIds) {
          var r = [];
          if (input) {
            if (typeof input === "string") {
              if (input === "*") {
                return input;
              }
              r.push(input);
            } else {
              if (doNotGetIds) {
                r = input;
              } else {
                if (input.length) {
                  for (var i2 = 0, j = input.length; i2 < j; i2++) {
                    r.push(_info(input[i2]).id);
                  }
                } else {
                  r.push(_info(input).id);
                }
              }
            }
          }
          return r;
        }, filterList = function(list, value, missingIsFalse) {
          if (list === "*") {
            return true;
          }
          return list.length > 0 ? list.indexOf(value) !== -1 : !missingIsFalse;
        };
        this.getConnections = function(options, flat) {
          if (!options) {
            options = {};
          } else if (options.constructor === String) {
            options = { "scope": options };
          }
          var scope = options.scope || _currentInstance.getDefaultScope(), scopes = prepareList(scope, true), sources = prepareList(options.source), targets = prepareList(options.target), results = !flat && scopes.length > 1 ? {} : [], _addOne = function(scope2, obj) {
            if (!flat && scopes.length > 1) {
              var ss = results[scope2];
              if (ss == null) {
                ss = results[scope2] = [];
              }
              ss.push(obj);
            } else {
              results.push(obj);
            }
          };
          for (var j = 0, jj = connections.length; j < jj; j++) {
            var c = connections[j], sourceId = c.proxies && c.proxies[0] ? c.proxies[0].originalEp.elementId : c.sourceId, targetId = c.proxies && c.proxies[1] ? c.proxies[1].originalEp.elementId : c.targetId;
            if (filterList(scopes, c.scope) && filterList(sources, sourceId) && filterList(targets, targetId)) {
              _addOne(c.scope, c);
            }
          }
          return results;
        };
        var _curryEach = function(list, executor) {
          return function(f) {
            for (var i2 = 0, ii = list.length; i2 < ii; i2++) {
              f(list[i2]);
            }
            return executor(list);
          };
        }, _curryGet = function(list) {
          return function(idx) {
            return list[idx];
          };
        };
        var _makeCommonSelectHandler = function(list, executor) {
          var out = {
            length: list.length,
            each: _curryEach(list, executor),
            get: _curryGet(list)
          }, setters = [
            "setHover",
            "removeAllOverlays",
            "setLabel",
            "addClass",
            "addOverlay",
            "removeOverlay",
            "removeOverlays",
            "showOverlay",
            "hideOverlay",
            "showOverlays",
            "hideOverlays",
            "setPaintStyle",
            "setHoverPaintStyle",
            "setSuspendEvents",
            "setParameter",
            "setParameters",
            "setVisible",
            "repaint",
            "addType",
            "toggleType",
            "removeType",
            "removeClass",
            "setType",
            "bind",
            "unbind"
          ], getters = [
            "getLabel",
            "getOverlay",
            "isHover",
            "getParameter",
            "getParameters",
            "getPaintStyle",
            "getHoverPaintStyle",
            "isVisible",
            "hasType",
            "getType",
            "isSuspendEvents"
          ], i2, ii;
          for (i2 = 0, ii = setters.length; i2 < ii; i2++) {
            out[setters[i2]] = setter(list, setters[i2], executor);
          }
          for (i2 = 0, ii = getters.length; i2 < ii; i2++) {
            out[getters[i2]] = getter(list, getters[i2]);
          }
          return out;
        };
        var _makeConnectionSelectHandler = function(list) {
          var common = _makeCommonSelectHandler(list, _makeConnectionSelectHandler);
          return jsPlumb2.extend(common, {
            // setters
            setDetachable: setter(list, "setDetachable", _makeConnectionSelectHandler),
            setReattach: setter(list, "setReattach", _makeConnectionSelectHandler),
            setConnector: setter(list, "setConnector", _makeConnectionSelectHandler),
            delete: function() {
              for (var i2 = 0, ii = list.length; i2 < ii; i2++) {
                _currentInstance.deleteConnection(list[i2]);
              }
            },
            // getters
            isDetachable: getter(list, "isDetachable"),
            isReattach: getter(list, "isReattach")
          });
        };
        var _makeEndpointSelectHandler = function(list) {
          var common = _makeCommonSelectHandler(list, _makeEndpointSelectHandler);
          return jsPlumb2.extend(common, {
            setEnabled: setter(list, "setEnabled", _makeEndpointSelectHandler),
            setAnchor: setter(list, "setAnchor", _makeEndpointSelectHandler),
            isEnabled: getter(list, "isEnabled"),
            deleteEveryConnection: function() {
              for (var i2 = 0, ii = list.length; i2 < ii; i2++) {
                list[i2].deleteEveryConnection();
              }
            },
            "delete": function() {
              for (var i2 = 0, ii = list.length; i2 < ii; i2++) {
                _currentInstance.deleteEndpoint(list[i2]);
              }
            }
          });
        };
        this.select = function(params) {
          params = params || {};
          params.scope = params.scope || "*";
          return _makeConnectionSelectHandler(params.connections || _currentInstance.getConnections(params, true));
        };
        this.selectEndpoints = function(params) {
          params = params || {};
          params.scope = params.scope || "*";
          var noElementFilters = !params.element && !params.source && !params.target, elements = noElementFilters ? "*" : prepareList(params.element), sources = noElementFilters ? "*" : prepareList(params.source), targets = noElementFilters ? "*" : prepareList(params.target), scopes = prepareList(params.scope, true);
          var ep = [];
          for (var el in endpointsByElement) {
            var either = filterList(elements, el, true), source = filterList(sources, el, true), sourceMatchExact = sources !== "*", target = filterList(targets, el, true), targetMatchExact = targets !== "*";
            if (either || source || target) {
              inner:
                for (var i2 = 0, ii = endpointsByElement[el].length; i2 < ii; i2++) {
                  var _ep = endpointsByElement[el][i2];
                  if (filterList(scopes, _ep.scope, true)) {
                    var noMatchSource = sourceMatchExact && sources.length > 0 && !_ep.isSource, noMatchTarget = targetMatchExact && targets.length > 0 && !_ep.isTarget;
                    if (noMatchSource || noMatchTarget) {
                      continue inner;
                    }
                    ep.push(_ep);
                  }
                }
            }
          }
          return _makeEndpointSelectHandler(ep);
        };
        this.getAllConnections = function() {
          return connections;
        };
        this.getDefaultScope = function() {
          return DEFAULT_SCOPE;
        };
        this.getEndpoint = _getEndpoint;
        this.getEndpoints = function(el) {
          return endpointsByElement[_info(el).id] || [];
        };
        this.getDefaultEndpointType = function() {
          return jsPlumb2.Endpoint;
        };
        this.getDefaultConnectionType = function() {
          return jsPlumb2.Connection;
        };
        this.getId = _getId;
        this.draw = _draw;
        this.info = _info;
        this.appendElement = _appendElement;
        var _hoverSuspended = false;
        this.isHoverSuspended = function() {
          return _hoverSuspended;
        };
        this.setHoverSuspended = function(s) {
          _hoverSuspended = s;
        };
        this.hide = function(el, changeEndpoints) {
          _setVisible(el, "none", changeEndpoints);
          return _currentInstance;
        };
        this.idstamp = _idstamp;
        var _ensureContainer = function(candidate) {
          if (!_container && candidate) {
            var can = _currentInstance.getElement(candidate);
            if (can.offsetParent) {
              _currentInstance.setContainer(can.offsetParent);
            }
          }
        };
        var _getContainerFromDefaults = function() {
          if (_currentInstance.Defaults.Container) {
            _currentInstance.setContainer(_currentInstance.Defaults.Container);
          }
        };
        var _manage = _currentInstance.manage = function(id, element, _transient, _recalc) {
          if (!managedElements[id]) {
            managedElements[id] = {
              el: element,
              endpoints: [],
              connections: [],
              rotation: 0
            };
            managedElements[id].info = _updateOffset({ elId: id, timestamp: _suspendedAt });
            _currentInstance.addClass(element, "jtk-managed");
            if (!_transient) {
              _currentInstance.fire("manageElement", { id, info: managedElements[id].info, el: element });
            }
          } else {
            if (_recalc) {
              managedElements[id].info = _updateOffset({ elId: id, timestamp: _suspendedAt, recalc: true });
            }
          }
          return managedElements[id];
        };
        this.unmanage = function(id) {
          if (managedElements[id]) {
            var el = managedElements[id].el;
            _currentInstance.removeClass(el, "jtk-managed");
            delete managedElements[id];
            _currentInstance.fire("unmanageElement", { id, el });
          }
        };
        this.rotate = function(elId, amountInDegrees, doNotRedraw) {
          if (managedElements[elId]) {
            managedElements[elId].rotation = amountInDegrees;
            managedElements[elId].el.style.transform = "rotate(" + amountInDegrees + "deg)";
            managedElements[elId].el.style.transformOrigin = "center center";
            if (doNotRedraw !== true) {
              return this.revalidate(elId);
            }
          }
          return {
            c: [],
            e: []
          };
        };
        this.getRotation = function(elementId) {
          return managedElements[elementId] ? managedElements[elementId].rotation || 0 : 0;
        };
        var _updateOffset = function(params) {
          var timestamp = params.timestamp, recalc = params.recalc, offset = params.offset, elId = params.elId, s;
          if (_suspendDrawing && !timestamp) {
            timestamp = _suspendedAt;
          }
          if (!recalc) {
            if (timestamp && timestamp === offsetTimestamps[elId]) {
              return { o: params.offset || offsets[elId], s: sizes[elId] };
            }
          }
          if (recalc || !offset && offsets[elId] == null) {
            s = managedElements[elId] ? managedElements[elId].el : null;
            if (s != null) {
              sizes[elId] = _currentInstance.getSize(s);
              offsets[elId] = _currentInstance.getOffset(s);
              offsetTimestamps[elId] = timestamp;
            }
          } else {
            offsets[elId] = offset || offsets[elId];
            if (sizes[elId] == null) {
              s = managedElements[elId].el;
              if (s != null) {
                sizes[elId] = _currentInstance.getSize(s);
              }
            }
            offsetTimestamps[elId] = timestamp;
          }
          if (offsets[elId] && !offsets[elId].right) {
            offsets[elId].right = offsets[elId].left + sizes[elId][0];
            offsets[elId].bottom = offsets[elId].top + sizes[elId][1];
            offsets[elId].width = sizes[elId][0];
            offsets[elId].height = sizes[elId][1];
            offsets[elId].centerx = offsets[elId].left + offsets[elId].width / 2;
            offsets[elId].centery = offsets[elId].top + offsets[elId].height / 2;
          }
          return { o: offsets[elId], s: sizes[elId] };
        };
        this.updateOffset = _updateOffset;
        this.init = (function() {
          if (!initialized) {
            _getContainerFromDefaults();
            _currentInstance.router = new root.jsPlumb.DefaultRouter(_currentInstance);
            _currentInstance.anchorManager = _currentInstance.router.anchorManager;
            initialized = true;
            _currentInstance.fire("ready", _currentInstance);
          }
        }).bind(this);
        this.log = log;
        this.jsPlumbUIComponent = jsPlumbUIComponent;
        this.makeAnchor = function() {
          var pp, _a = function(t, p) {
            if (root.jsPlumb.Anchors[t]) {
              return new root.jsPlumb.Anchors[t](p);
            }
            if (!_currentInstance.Defaults.DoNotThrowErrors) {
              throw { msg: "jsPlumb: unknown anchor type '" + t + "'" };
            }
          };
          if (arguments.length === 0) {
            return null;
          }
          var specimen = arguments[0], elementId = arguments[1], newAnchor = null;
          if (specimen.compute && specimen.getOrientation) {
            return specimen;
          } else if (typeof specimen === "string") {
            newAnchor = _a(arguments[0], { elementId, jsPlumbInstance: _currentInstance });
          } else if (_ju.isArray(specimen)) {
            if (_ju.isArray(specimen[0]) || _ju.isString(specimen[0])) {
              if (specimen.length === 2 && _ju.isObject(specimen[1])) {
                if (_ju.isString(specimen[0])) {
                  pp = root.jsPlumb.extend({ elementId, jsPlumbInstance: _currentInstance }, specimen[1]);
                  newAnchor = _a(specimen[0], pp);
                } else {
                  pp = root.jsPlumb.extend({ elementId, jsPlumbInstance: _currentInstance, anchors: specimen[0] }, specimen[1]);
                  newAnchor = new root.jsPlumb.DynamicAnchor(pp);
                }
              } else {
                newAnchor = new jsPlumb2.DynamicAnchor({ anchors: specimen, selector: null, elementId, jsPlumbInstance: _currentInstance });
              }
            } else {
              var anchorParams = {
                x: specimen[0],
                y: specimen[1],
                orientation: specimen.length >= 4 ? [specimen[2], specimen[3]] : [0, 0],
                offsets: specimen.length >= 6 ? [specimen[4], specimen[5]] : [0, 0],
                elementId,
                jsPlumbInstance: _currentInstance,
                cssClass: specimen.length === 7 ? specimen[6] : null
              };
              newAnchor = new root.jsPlumb.Anchor(anchorParams);
              newAnchor.clone = function() {
                return new root.jsPlumb.Anchor(anchorParams);
              };
            }
          }
          if (!newAnchor.id) {
            newAnchor.id = "anchor_" + _idstamp();
          }
          return newAnchor;
        };
        this.makeAnchors = function(types, elementId, jsPlumbInstance2) {
          var r = [];
          for (var i2 = 0, ii = types.length; i2 < ii; i2++) {
            if (typeof types[i2] === "string") {
              r.push(root.jsPlumb.Anchors[types[i2]]({ elementId, jsPlumbInstance: jsPlumbInstance2 }));
            } else if (_ju.isArray(types[i2])) {
              r.push(_currentInstance.makeAnchor(types[i2], elementId, jsPlumbInstance2));
            }
          }
          return r;
        };
        this.makeDynamicAnchor = function(anchors, anchorSelector) {
          return new root.jsPlumb.DynamicAnchor({ anchors, selector: anchorSelector, elementId: null, jsPlumbInstance: _currentInstance });
        };
        this.targetEndpointDefinitions = {};
        this.sourceEndpointDefinitions = {};
        var selectorFilter = function(evt, _el, selector, _instance, negate) {
          var t = evt.target || evt.srcElement, ok = false, sel = _instance.getSelector(_el, selector);
          for (var j = 0; j < sel.length; j++) {
            if (sel[j] === t) {
              ok = true;
              break;
            }
          }
          return negate ? !ok : ok;
        };
        var _makeElementDropHandler = function(elInfo, p, dropOptions, isSource, isTarget) {
          var proxyComponent = new jsPlumbUIComponent(p);
          var _drop = p._jsPlumb.EndpointDropHandler({
            jsPlumb: _currentInstance,
            enabled: function() {
              return elInfo.def.enabled;
            },
            isFull: function() {
              var targetCount = _currentInstance.select({ target: elInfo.id }).length;
              return elInfo.def.maxConnections > 0 && targetCount >= elInfo.def.maxConnections;
            },
            element: elInfo.el,
            elementId: elInfo.id,
            isSource,
            isTarget,
            addClass: function(clazz) {
              _currentInstance.addClass(elInfo.el, clazz);
            },
            removeClass: function(clazz) {
              _currentInstance.removeClass(elInfo.el, clazz);
            },
            onDrop: function(jpc) {
              var source = jpc.endpoints[0];
              source.anchor.locked = false;
            },
            isDropAllowed: function() {
              return proxyComponent.isDropAllowed.apply(proxyComponent, arguments);
            },
            isRedrop: function(jpc) {
              return jpc.suspendedElement != null && jpc.suspendedEndpoint != null && jpc.suspendedEndpoint.element === elInfo.el;
            },
            getEndpoint: function(jpc) {
              var newEndpoint = elInfo.def.endpoint;
              if (newEndpoint == null || newEndpoint._jsPlumb == null) {
                var eps = _currentInstance.deriveEndpointAndAnchorSpec(jpc.getType().join(" "), true);
                var pp = eps.endpoints ? root.jsPlumb.extend(p, {
                  endpoint: elInfo.def.def.endpoint || eps.endpoints[1]
                }) : p;
                if (eps.anchors) {
                  pp = root.jsPlumb.extend(pp, {
                    anchor: elInfo.def.def.anchor || eps.anchors[1]
                  });
                }
                newEndpoint = _currentInstance.addEndpoint(elInfo.el, pp);
                newEndpoint._mtNew = true;
              }
              if (p.uniqueEndpoint) {
                elInfo.def.endpoint = newEndpoint;
              }
              newEndpoint.setDeleteOnEmpty(true);
              if (jpc.isDetachable()) {
                newEndpoint.initDraggable();
              }
              if (newEndpoint.anchor.positionFinder != null) {
                var dropPosition = _currentInstance.getUIPosition(arguments, _currentInstance.getZoom()), elPosition = _currentInstance.getOffset(elInfo.el), elSize = _currentInstance.getSize(elInfo.el), ap = dropPosition == null ? [0, 0] : newEndpoint.anchor.positionFinder(dropPosition, elPosition, elSize, newEndpoint.anchor.constructorParams);
                newEndpoint.anchor.x = ap[0];
                newEndpoint.anchor.y = ap[1];
              }
              return newEndpoint;
            },
            maybeCleanup: function(ep) {
              if (ep._mtNew && ep.connections.length === 0) {
                _currentInstance.deleteObject({ endpoint: ep });
              } else {
                delete ep._mtNew;
              }
            }
          });
          var dropEvent = root.jsPlumb.dragEvents.drop;
          dropOptions.scope = dropOptions.scope || (p.scope || _currentInstance.Defaults.Scope);
          dropOptions[dropEvent] = _ju.wrap(dropOptions[dropEvent], _drop, true);
          dropOptions.rank = p.rank || 0;
          if (isTarget) {
            dropOptions[root.jsPlumb.dragEvents.over] = function() {
              return true;
            };
          }
          if (p.allowLoopback === false) {
            dropOptions.canDrop = function(_drag) {
              var de = _drag.getDragElement()._jsPlumbRelatedElement;
              return de !== elInfo.el;
            };
          }
          _currentInstance.initDroppable(elInfo.el, dropOptions, "internal");
          return _drop;
        };
        this.makeTarget = function(el, params, referenceParams) {
          var p = root.jsPlumb.extend({ _jsPlumb: this }, referenceParams);
          root.jsPlumb.extend(p, params);
          var maxConnections = p.maxConnections || -1, _doOne = (function(el2) {
            var elInfo = _info(el2), elid = elInfo.id, dropOptions = root.jsPlumb.extend({}, p.dropOptions || {}), type = p.connectionType || "default";
            this.targetEndpointDefinitions[elid] = this.targetEndpointDefinitions[elid] || {};
            _ensureContainer(elid);
            if (elInfo.el._isJsPlumbGroup && dropOptions.rank == null) {
              dropOptions.rank = -1;
            }
            var _def = {
              def: root.jsPlumb.extend({}, p),
              uniqueEndpoint: p.uniqueEndpoint,
              maxConnections,
              enabled: true
            };
            if (p.createEndpoint) {
              _def.uniqueEndpoint = true;
              _def.endpoint = _currentInstance.addEndpoint(el2, _def.def);
              _def.endpoint.setDeleteOnEmpty(false);
            }
            elInfo.def = _def;
            this.targetEndpointDefinitions[elid][type] = _def;
            _makeElementDropHandler(elInfo, p, dropOptions, p.isSource === true, true);
            elInfo.el._katavorioDrop[elInfo.el._katavorioDrop.length - 1].targetDef = _def;
          }).bind(this);
          var inputs = el.length && el.constructor !== String ? el : [el];
          for (var i2 = 0, ii = inputs.length; i2 < ii; i2++) {
            _doOne(inputs[i2]);
          }
          return this;
        };
        this.unmakeTarget = function(el, doNotClearArrays) {
          var info = _info(el);
          _currentInstance.destroyDroppable(info.el, "internal");
          if (!doNotClearArrays) {
            delete this.targetEndpointDefinitions[info.id];
          }
          return this;
        };
        this.makeSource = function(el, params, referenceParams) {
          var p = root.jsPlumb.extend({ _jsPlumb: this }, referenceParams);
          root.jsPlumb.extend(p, params);
          var type = p.connectionType || "default";
          var aae = _currentInstance.deriveEndpointAndAnchorSpec(type);
          p.endpoint = p.endpoint || aae.endpoints[0];
          p.anchor = p.anchor || aae.anchors[0];
          var maxConnections = p.maxConnections || -1, onMaxConnections = p.onMaxConnections, _doOne = (function(elInfo) {
            var elid = elInfo.id, _del = this.getElement(elInfo.el);
            this.sourceEndpointDefinitions[elid] = this.sourceEndpointDefinitions[elid] || {};
            _ensureContainer(elid);
            var _def = {
              def: root.jsPlumb.extend({}, p),
              uniqueEndpoint: p.uniqueEndpoint,
              maxConnections,
              enabled: true
            };
            if (p.createEndpoint) {
              _def.uniqueEndpoint = true;
              _def.endpoint = _currentInstance.addEndpoint(el, _def.def);
              _def.endpoint.setDeleteOnEmpty(false);
            }
            this.sourceEndpointDefinitions[elid][type] = _def;
            elInfo.def = _def;
            var stopEvent = root.jsPlumb.dragEvents.stop, dragEvent = root.jsPlumb.dragEvents.drag, dragOptions = root.jsPlumb.extend({}, p.dragOptions || {}), existingDrag = dragOptions.drag, existingStop = dragOptions.stop, ep = null, endpointAddedButNoDragYet = false;
            dragOptions.scope = dragOptions.scope || p.scope;
            dragOptions[dragEvent] = _ju.wrap(dragOptions[dragEvent], function() {
              if (existingDrag) {
                existingDrag.apply(this, arguments);
              }
              endpointAddedButNoDragYet = false;
            });
            dragOptions[stopEvent] = _ju.wrap(dragOptions[stopEvent], (function() {
              if (existingStop) {
                existingStop.apply(this, arguments);
              }
              this.currentlyDragging = false;
              if (ep._jsPlumb != null) {
                var anchorDef = p.anchor || this.Defaults.Anchor, oldAnchor = ep.anchor, oldConnection = ep.connections[0];
                var newAnchor = this.makeAnchor(anchorDef, elid, this), _el = ep.element;
                if (newAnchor.positionFinder != null) {
                  var elPosition = _currentInstance.getOffset(_el), elSize = this.getSize(_el), dropPosition = { left: elPosition.left + oldAnchor.x * elSize[0], top: elPosition.top + oldAnchor.y * elSize[1] }, ap = newAnchor.positionFinder(dropPosition, elPosition, elSize, newAnchor.constructorParams);
                  newAnchor.x = ap[0];
                  newAnchor.y = ap[1];
                }
                ep.setAnchor(newAnchor, true);
                ep.repaint();
                this.repaint(ep.elementId);
                if (oldConnection != null) {
                  this.repaint(oldConnection.targetId);
                }
              }
            }).bind(this));
            var mouseDownListener = (function(e) {
              if (e.which === 3 || e.button === 2) {
                return;
              }
              elid = this.getId(this.getElement(elInfo.el));
              var def = this.sourceEndpointDefinitions[elid][type];
              if (!def.enabled) {
                return;
              }
              if (p.filter) {
                var r = _ju.isString(p.filter) ? selectorFilter(e, elInfo.el, p.filter, this, p.filterExclude) : p.filter(e, elInfo.el);
                if (r === false) {
                  return;
                }
              }
              var sourceCount = this.select({ source: elid }).length;
              if (def.maxConnections >= 0 && sourceCount >= def.maxConnections) {
                if (onMaxConnections) {
                  onMaxConnections({
                    element: elInfo.el,
                    maxConnections
                  }, e);
                }
                return false;
              }
              var elxy = root.jsPlumb.getPositionOnElement(e, _del, _zoom);
              var tempEndpointParams = {};
              root.jsPlumb.extend(tempEndpointParams, def.def);
              tempEndpointParams.isTemporarySource = true;
              tempEndpointParams.anchor = [elxy[0], elxy[1], 0, 0];
              tempEndpointParams.dragOptions = dragOptions;
              if (def.def.scope) {
                tempEndpointParams.scope = def.def.scope;
              }
              ep = this.addEndpoint(elid, tempEndpointParams);
              endpointAddedButNoDragYet = true;
              ep.setDeleteOnEmpty(true);
              if (def.uniqueEndpoint) {
                if (!def.endpoint) {
                  def.endpoint = ep;
                  ep.setDeleteOnEmpty(false);
                } else {
                  ep.finalEndpoint = def.endpoint;
                }
              }
              var _delTempEndpoint = function() {
                _currentInstance.off(ep.canvas, "mouseup", _delTempEndpoint);
                _currentInstance.off(elInfo.el, "mouseup", _delTempEndpoint);
                if (endpointAddedButNoDragYet) {
                  endpointAddedButNoDragYet = false;
                  _currentInstance.deleteEndpoint(ep);
                }
              };
              _currentInstance.on(ep.canvas, "mouseup", _delTempEndpoint);
              _currentInstance.on(elInfo.el, "mouseup", _delTempEndpoint);
              var payload = {};
              if (def.def.extract) {
                for (var att in def.def.extract) {
                  var v = (e.srcElement || e.target).getAttribute(att);
                  if (v) {
                    payload[def.def.extract[att]] = v;
                  }
                }
              }
              _currentInstance.trigger(ep.canvas, "mousedown", e, payload);
              _ju.consume(e);
            }).bind(this);
            this.on(elInfo.el, "mousedown", mouseDownListener);
            _def.trigger = mouseDownListener;
            if (p.filter && (_ju.isString(p.filter) || _ju.isFunction(p.filter))) {
              _currentInstance.setDragFilter(elInfo.el, p.filter);
            }
            var dropOptions = root.jsPlumb.extend({}, p.dropOptions || {});
            _makeElementDropHandler(elInfo, p, dropOptions, true, p.isTarget === true);
          }).bind(this);
          var inputs = el.length && el.constructor !== String ? el : [el];
          for (var i2 = 0, ii = inputs.length; i2 < ii; i2++) {
            _doOne(_info(inputs[i2]));
          }
          return this;
        };
        this.unmakeSource = function(el, connectionType, doNotClearArrays) {
          var info = _info(el);
          _currentInstance.destroyDroppable(info.el, "internal");
          var eldefs = this.sourceEndpointDefinitions[info.id];
          if (eldefs) {
            for (var def in eldefs) {
              if (connectionType == null || connectionType === def) {
                var mouseDownListener = eldefs[def].trigger;
                if (mouseDownListener) {
                  _currentInstance.off(info.el, "mousedown", mouseDownListener);
                }
                if (!doNotClearArrays) {
                  delete this.sourceEndpointDefinitions[info.id][def];
                }
              }
            }
          }
          return this;
        };
        this.unmakeEverySource = function() {
          for (var i2 in this.sourceEndpointDefinitions) {
            _currentInstance.unmakeSource(i2, null, true);
          }
          this.sourceEndpointDefinitions = {};
          return this;
        };
        var _getScope = (function(el, types, connectionType) {
          types = _ju.isArray(types) ? types : [types];
          var id = _getId(el);
          connectionType = connectionType || "default";
          for (var i2 = 0; i2 < types.length; i2++) {
            var eldefs = this[types[i2]][id];
            if (eldefs && eldefs[connectionType]) {
              return eldefs[connectionType].def.scope || this.Defaults.Scope;
            }
          }
        }).bind(this);
        var _setScope = (function(el, scope, types, connectionType) {
          types = _ju.isArray(types) ? types : [types];
          var id = _getId(el);
          connectionType = connectionType || "default";
          for (var i2 = 0; i2 < types.length; i2++) {
            var eldefs = this[types[i2]][id];
            if (eldefs && eldefs[connectionType]) {
              eldefs[connectionType].def.scope = scope;
            }
          }
        }).bind(this);
        this.getScope = function(el, scope) {
          return _getScope(el, ["sourceEndpointDefinitions", "targetEndpointDefinitions"]);
        };
        this.getSourceScope = function(el) {
          return _getScope(el, "sourceEndpointDefinitions");
        };
        this.getTargetScope = function(el) {
          return _getScope(el, "targetEndpointDefinitions");
        };
        this.setScope = function(el, scope, connectionType) {
          this.setSourceScope(el, scope, connectionType);
          this.setTargetScope(el, scope, connectionType);
        };
        this.setSourceScope = function(el, scope, connectionType) {
          _setScope(el, scope, "sourceEndpointDefinitions", connectionType);
          this.setDragScope(el, scope);
        };
        this.setTargetScope = function(el, scope, connectionType) {
          _setScope(el, scope, "targetEndpointDefinitions", connectionType);
          this.setDropScope(el, scope);
        };
        this.unmakeEveryTarget = function() {
          for (var i2 in this.targetEndpointDefinitions) {
            _currentInstance.unmakeTarget(i2, true);
          }
          this.targetEndpointDefinitions = {};
          return this;
        };
        var _setEnabled = (function(type, el, state, toggle, connectionType) {
          var a = type === "source" ? this.sourceEndpointDefinitions : this.targetEndpointDefinitions, originalState, info, newState;
          connectionType = connectionType || "default";
          if (el.length && !_ju.isString(el)) {
            originalState = [];
            for (var i2 = 0, ii = el.length; i2 < ii; i2++) {
              info = _info(el[i2]);
              if (a[info.id] && a[info.id][connectionType]) {
                originalState[i2] = a[info.id][connectionType].enabled;
                newState = toggle ? !originalState[i2] : state;
                a[info.id][connectionType].enabled = newState;
                _currentInstance[newState ? "removeClass" : "addClass"](info.el, "jtk-" + type + "-disabled");
              }
            }
          } else {
            info = _info(el);
            var id = info.id;
            if (a[id] && a[id][connectionType]) {
              originalState = a[id][connectionType].enabled;
              newState = toggle ? !originalState : state;
              a[id][connectionType].enabled = newState;
              _currentInstance[newState ? "removeClass" : "addClass"](info.el, "jtk-" + type + "-disabled");
            }
          }
          return originalState;
        }).bind(this);
        var _first = (function(el, fn) {
          if (el != null) {
            if (_ju.isString(el) || !el.length) {
              return fn.apply(this, [el]);
            } else if (el.length) {
              return fn.apply(this, [el[0]]);
            }
          }
        }).bind(this);
        this.toggleSourceEnabled = function(el, connectionType) {
          _setEnabled("source", el, null, true, connectionType);
          return this.isSourceEnabled(el, connectionType);
        };
        this.setSourceEnabled = function(el, state, connectionType) {
          return _setEnabled("source", el, state, null, connectionType);
        };
        this.isSource = function(el, connectionType) {
          connectionType = connectionType || "default";
          return _first(el, (function(_el) {
            var eldefs = this.sourceEndpointDefinitions[_info(_el).id];
            return eldefs != null && eldefs[connectionType] != null;
          }).bind(this));
        };
        this.isSourceEnabled = function(el, connectionType) {
          connectionType = connectionType || "default";
          return _first(el, (function(_el) {
            var sep = this.sourceEndpointDefinitions[_info(_el).id];
            return sep && sep[connectionType] && sep[connectionType].enabled === true;
          }).bind(this));
        };
        this.toggleTargetEnabled = function(el, connectionType) {
          _setEnabled("target", el, null, true, connectionType);
          return this.isTargetEnabled(el, connectionType);
        };
        this.isTarget = function(el, connectionType) {
          connectionType = connectionType || "default";
          return _first(el, (function(_el) {
            var eldefs = this.targetEndpointDefinitions[_info(_el).id];
            return eldefs != null && eldefs[connectionType] != null;
          }).bind(this));
        };
        this.isTargetEnabled = function(el, connectionType) {
          connectionType = connectionType || "default";
          return _first(el, (function(_el) {
            var tep = this.targetEndpointDefinitions[_info(_el).id];
            return tep && tep[connectionType] && tep[connectionType].enabled === true;
          }).bind(this));
        };
        this.setTargetEnabled = function(el, state, connectionType) {
          return _setEnabled("target", el, state, null, connectionType);
        };
        this.ready = function(fn) {
          _currentInstance.bind("ready", fn);
        };
        var _elEach = function(el, fn) {
          if (typeof el === "object" && el.length) {
            for (var i2 = 0, ii = el.length; i2 < ii; i2++) {
              fn(el[i2]);
            }
          } else {
            fn(el);
          }
          return _currentInstance;
        };
        this.repaint = function(el, ui, timestamp) {
          return _elEach(el, function(_el) {
            _draw(_el, ui, timestamp);
          });
        };
        this.revalidate = function(el, timestamp, isIdAlready) {
          var elId = isIdAlready ? el : _currentInstance.getId(el);
          _currentInstance.updateOffset({ elId, recalc: true, timestamp });
          var dm = _currentInstance.getDragManager();
          if (dm) {
            dm.updateOffsets(elId);
          }
          return _draw(el, null, timestamp);
        };
        this.repaintEverything = function() {
          var timestamp = jsPlumbUtil.uuid(), elId;
          for (elId in endpointsByElement) {
            _currentInstance.updateOffset({ elId, recalc: true, timestamp });
          }
          for (elId in endpointsByElement) {
            _draw(elId, null, timestamp);
          }
          return this;
        };
        this.removeAllEndpoints = function(el, recurse, affectedElements) {
          affectedElements = affectedElements || [];
          var _one = function(_el) {
            var info = _info(_el), ebe = endpointsByElement[info.id], i2, ii;
            if (ebe) {
              affectedElements.push(info);
              for (i2 = 0, ii = ebe.length; i2 < ii; i2++) {
                _currentInstance.deleteEndpoint(ebe[i2], false);
              }
            }
            delete endpointsByElement[info.id];
            if (recurse) {
              if (info.el && info.el.nodeType !== 3 && info.el.nodeType !== 8) {
                for (i2 = 0, ii = info.el.childNodes.length; i2 < ii; i2++) {
                  _one(info.el.childNodes[i2]);
                }
              }
            }
          };
          _one(el);
          return this;
        };
        var _doRemove = function(info, affectedElements) {
          _currentInstance.removeAllEndpoints(info.id, true, affectedElements);
          var dm = _currentInstance.getDragManager();
          var _one = function(_info2) {
            if (dm) {
              dm.elementRemoved(_info2.id);
            }
            _currentInstance.router.elementRemoved(_info2.id);
            if (_currentInstance.isSource(_info2.el)) {
              _currentInstance.unmakeSource(_info2.el);
            }
            if (_currentInstance.isTarget(_info2.el)) {
              _currentInstance.unmakeTarget(_info2.el);
            }
            _currentInstance.destroyDraggable(_info2.el);
            _currentInstance.destroyDroppable(_info2.el);
            delete _currentInstance.floatingConnections[_info2.id];
            delete managedElements[_info2.id];
            delete offsets[_info2.id];
            if (_info2.el) {
              _currentInstance.removeElement(_info2.el);
              _info2.el._jsPlumb = null;
            }
          };
          for (var ae = 1; ae < affectedElements.length; ae++) {
            _one(affectedElements[ae]);
          }
          _one(info);
        };
        this.remove = function(el, doNotRepaint) {
          var info = _info(el), affectedElements = [];
          if (info.text && info.el.parentNode) {
            info.el.parentNode.removeChild(info.el);
          } else if (info.id) {
            _currentInstance.batch(function() {
              _doRemove(info, affectedElements);
            }, doNotRepaint === true);
          }
          return _currentInstance;
        };
        this.empty = function(el, doNotRepaint) {
          var affectedElements = [];
          var _one = function(el2, dontRemoveFocus) {
            var info = _info(el2);
            if (info.text) {
              info.el.parentNode.removeChild(info.el);
            } else if (info.el) {
              while (info.el.childNodes.length > 0) {
                _one(info.el.childNodes[0]);
              }
              if (!dontRemoveFocus) {
                _doRemove(info, affectedElements);
              }
            }
          };
          _currentInstance.batch(function() {
            _one(el, true);
          }, doNotRepaint === false);
          return _currentInstance;
        };
        this.reset = function(doNotUnbindInstanceEventListeners) {
          _currentInstance.silently((function() {
            _hoverSuspended = false;
            _currentInstance.removeAllGroups();
            _currentInstance.removeGroupManager();
            _currentInstance.deleteEveryEndpoint();
            if (!doNotUnbindInstanceEventListeners) {
              _currentInstance.unbind();
            }
            this.targetEndpointDefinitions = {};
            this.sourceEndpointDefinitions = {};
            connections.length = 0;
            if (this.doReset) {
              this.doReset();
            }
          }).bind(this));
        };
        this.destroy = function() {
          this.reset();
          _container = null;
          _containerDelegations = null;
        };
        var _clearObject = function(obj) {
          if (obj.canvas && obj.canvas.parentNode) {
            obj.canvas.parentNode.removeChild(obj.canvas);
          }
          obj.cleanup();
          obj.destroy();
        };
        this.clear = function() {
          _currentInstance.select().each(_clearObject);
          _currentInstance.selectEndpoints().each(_clearObject);
          endpointsByElement = {};
          endpointsByUUID = {};
        };
        this.setDefaultScope = function(scope) {
          DEFAULT_SCOPE = scope;
          return _currentInstance;
        };
        this.deriveEndpointAndAnchorSpec = function(type, dontPrependDefault) {
          var bits = ((dontPrependDefault ? "" : "default ") + type).split(/[\s]/), eps = null, ep = null, a = null, as = null;
          for (var i2 = 0; i2 < bits.length; i2++) {
            var _t = _currentInstance.getType(bits[i2], "connection");
            if (_t) {
              if (_t.endpoints) {
                eps = _t.endpoints;
              }
              if (_t.endpoint) {
                ep = _t.endpoint;
              }
              if (_t.anchors) {
                as = _t.anchors;
              }
              if (_t.anchor) {
                a = _t.anchor;
              }
            }
          }
          return { endpoints: eps ? eps : [ep, ep], anchors: as ? as : [a, a] };
        };
        this.setId = function(el, newId, doNotSetAttribute) {
          var id;
          if (_ju.isString(el)) {
            id = el;
          } else {
            el = this.getElement(el);
            id = this.getId(el);
          }
          var sConns = this.getConnections({ source: id, scope: "*" }, true), tConns = this.getConnections({ target: id, scope: "*" }, true);
          newId = "" + newId;
          if (!doNotSetAttribute) {
            el = this.getElement(id);
            this.setAttribute(el, "id", newId);
          } else {
            el = this.getElement(newId);
          }
          endpointsByElement[newId] = endpointsByElement[id] || [];
          for (var i2 = 0, ii = endpointsByElement[newId].length; i2 < ii; i2++) {
            endpointsByElement[newId][i2].setElementId(newId);
            endpointsByElement[newId][i2].setReferenceElement(el);
          }
          delete endpointsByElement[id];
          this.sourceEndpointDefinitions[newId] = this.sourceEndpointDefinitions[id];
          delete this.sourceEndpointDefinitions[id];
          this.targetEndpointDefinitions[newId] = this.targetEndpointDefinitions[id];
          delete this.targetEndpointDefinitions[id];
          this.router.changeId(id, newId);
          var dm = this.getDragManager();
          if (dm) {
            dm.changeId(id, newId);
          }
          managedElements[newId] = managedElements[id];
          delete managedElements[id];
          var _conns = function(list, epIdx, type) {
            for (var i3 = 0, ii2 = list.length; i3 < ii2; i3++) {
              list[i3].endpoints[epIdx].setElementId(newId);
              list[i3].endpoints[epIdx].setReferenceElement(el);
              list[i3][type + "Id"] = newId;
              list[i3][type] = el;
            }
          };
          _conns(sConns, 0, "source");
          _conns(tConns, 1, "target");
          this.repaint(newId);
        };
        this.setDebugLog = function(debugLog) {
          log = debugLog;
        };
        this.setSuspendDrawing = function(val, repaintAfterwards) {
          var curVal = _suspendDrawing;
          _suspendDrawing = val;
          if (val) {
            _suspendedAt = (/* @__PURE__ */ new Date()).getTime();
          } else {
            _suspendedAt = null;
          }
          if (repaintAfterwards) {
            this.repaintEverything();
          }
          return curVal;
        };
        this.isSuspendDrawing = function() {
          return _suspendDrawing;
        };
        this.getSuspendedAt = function() {
          return _suspendedAt;
        };
        this.batch = function(fn, doNotRepaintAfterwards) {
          var _wasSuspended = this.isSuspendDrawing();
          if (!_wasSuspended) {
            this.setSuspendDrawing(true);
          }
          try {
            fn();
          } catch (e) {
            _ju.log("Function run while suspended failed", e);
          }
          if (!_wasSuspended) {
            this.setSuspendDrawing(false, !doNotRepaintAfterwards);
          }
        };
        this.doWhileSuspended = this.batch;
        this.getCachedData = _getCachedData;
        this.show = function(el, changeEndpoints) {
          _setVisible(el, "block", changeEndpoints);
          return _currentInstance;
        };
        this.toggleVisible = _toggleVisible;
        this.addListener = this.bind;
        var floatingConnections = [];
        this.registerFloatingConnection = function(info, conn, ep) {
          floatingConnections[info.id] = conn;
          _ju.addToList(endpointsByElement, info.id, ep);
        };
        this.getFloatingConnectionFor = function(id) {
          return floatingConnections[id];
        };
        this.listManager = new root.jsPlumbListManager(this, this.Defaults.ListStyle);
      };
      _ju.extend(root.jsPlumbInstance, _ju.EventGenerator, {
        setAttribute: function(el, a, v) {
          this.setAttribute(el, a, v);
        },
        getAttribute: function(el, a) {
          return this.getAttribute(root.jsPlumb.getElement(el), a);
        },
        convertToFullOverlaySpec: function(spec) {
          if (_ju.isString(spec)) {
            spec = [spec, {}];
          }
          spec[1].id = spec[1].id || _ju.uuid();
          return spec;
        },
        registerConnectionType: function(id, type) {
          this._connectionTypes[id] = root.jsPlumb.extend({}, type);
          if (type.overlays) {
            var to = {};
            for (var i = 0; i < type.overlays.length; i++) {
              var fo = this.convertToFullOverlaySpec(type.overlays[i]);
              to[fo[1].id] = fo;
            }
            this._connectionTypes[id].overlays = to;
          }
        },
        registerConnectionTypes: function(types) {
          for (var i in types) {
            this.registerConnectionType(i, types[i]);
          }
        },
        registerEndpointType: function(id, type) {
          this._endpointTypes[id] = root.jsPlumb.extend({}, type);
          if (type.overlays) {
            var to = {};
            for (var i = 0; i < type.overlays.length; i++) {
              var fo = this.convertToFullOverlaySpec(type.overlays[i]);
              to[fo[1].id] = fo;
            }
            this._endpointTypes[id].overlays = to;
          }
        },
        registerEndpointTypes: function(types) {
          for (var i in types) {
            this.registerEndpointType(i, types[i]);
          }
        },
        getType: function(id, typeDescriptor) {
          return typeDescriptor === "connection" ? this._connectionTypes[id] : this._endpointTypes[id];
        },
        setIdChanged: function(oldId, newId) {
          this.setId(oldId, newId, true);
        },
        // set parent: change the parent for some node and update all the registrations we need to.
        setParent: function(el, newParent) {
          var _dom = this.getElement(el), _id = this.getId(_dom), _pdom = this.getElement(newParent), _pid = this.getId(_pdom), dm = this.getDragManager();
          _dom.parentNode.removeChild(_dom);
          _pdom.appendChild(_dom);
          if (dm) {
            dm.setParent(_dom, _id, _pdom, _pid);
          }
        },
        extend: function(o1, o2, names) {
          var i;
          if (names) {
            for (i = 0; i < names.length; i++) {
              o1[names[i]] = o2[names[i]];
            }
          } else {
            for (i in o2) {
              o1[i] = o2[i];
            }
          }
          return o1;
        },
        floatingConnections: {},
        getFloatingAnchorIndex: function(jpc) {
          return jpc.endpoints[0].isFloating() ? 0 : jpc.endpoints[1].isFloating() ? 1 : -1;
        },
        proxyConnection: function(connection, index, proxyEl, proxyElId, endpointGenerator, anchorGenerator) {
          var proxyEp, originalElementId = connection.endpoints[index].elementId, originalEndpoint = connection.endpoints[index];
          connection.proxies = connection.proxies || [];
          if (connection.proxies[index]) {
            proxyEp = connection.proxies[index].ep;
          } else {
            proxyEp = this.addEndpoint(proxyEl, {
              endpoint: endpointGenerator(connection, index),
              anchor: anchorGenerator(connection, index),
              parameters: {
                isProxyEndpoint: true
              }
            });
          }
          proxyEp.setDeleteOnEmpty(true);
          connection.proxies[index] = { ep: proxyEp, originalEp: originalEndpoint };
          if (index === 0) {
            this.router.sourceOrTargetChanged(originalElementId, proxyElId, connection, proxyEl, 0);
          } else {
            this.router.sourceOrTargetChanged(originalElementId, proxyElId, connection, proxyEl, 1);
          }
          originalEndpoint.detachFromConnection(connection, null, true);
          proxyEp.connections = [connection];
          connection.endpoints[index] = proxyEp;
          originalEndpoint.setVisible(false);
          connection.setVisible(true);
          this.revalidate(proxyEl);
        },
        unproxyConnection: function(connection, index, proxyElId) {
          if (connection._jsPlumb == null || connection.proxies == null || connection.proxies[index] == null) {
            return;
          }
          var originalElement = connection.proxies[index].originalEp.element, originalElementId = connection.proxies[index].originalEp.elementId;
          connection.endpoints[index] = connection.proxies[index].originalEp;
          if (index === 0) {
            this.router.sourceOrTargetChanged(proxyElId, originalElementId, connection, originalElement, 0);
          } else {
            this.router.sourceOrTargetChanged(proxyElId, originalElementId, connection, originalElement, 1);
          }
          connection.proxies[index].ep.detachFromConnection(connection, null);
          connection.proxies[index].originalEp.addConnection(connection);
          if (connection.isVisible()) {
            connection.proxies[index].originalEp.setVisible(true);
          }
          delete connection.proxies[index];
        }
      });
      var jsPlumb2 = new jsPlumbInstance();
      root.jsPlumb = jsPlumb2;
      jsPlumb2.getInstance = function(_defaults, overrideFns) {
        var j = new jsPlumbInstance(_defaults);
        if (overrideFns) {
          for (var ovf in overrideFns) {
            j[ovf] = overrideFns[ovf];
          }
        }
        j.init();
        return j;
      };
      jsPlumb2.each = function(spec, fn) {
        if (spec == null) {
          return;
        }
        if (typeof spec === "string") {
          fn(jsPlumb2.getElement(spec));
        } else if (spec.length != null) {
          for (var i = 0; i < spec.length; i++) {
            fn(jsPlumb2.getElement(spec[i]));
          }
        } else {
          fn(spec);
        }
      };
      {
        exports.jsPlumb = jsPlumb2;
      }
    }).call(typeof window !== "undefined" ? window : jsplumb);
    (function() {
      var root = this, _jp = root.jsPlumb, _ju = root.jsPlumbUtil;
      var _internalLabelOverlayId = "__label", _makeLabelOverlay = function(component, params) {
        var _params = {
          cssClass: params.cssClass,
          labelStyle: component.labelStyle,
          id: _internalLabelOverlayId,
          component,
          _jsPlumb: component._jsPlumb.instance
          // TODO not necessary, since the instance can be accessed through the component.
        }, mergedParams = _jp.extend(_params, params);
        return new _jp.Overlays[component._jsPlumb.instance.getRenderMode()].Label(mergedParams);
      }, _processOverlay = function(component, o) {
        var _newOverlay = null;
        if (_ju.isArray(o)) {
          var type = o[0], p = _jp.extend({ component, _jsPlumb: component._jsPlumb.instance }, o[1]);
          if (o.length === 3) {
            _jp.extend(p, o[2]);
          }
          _newOverlay = new _jp.Overlays[component._jsPlumb.instance.getRenderMode()][type](p);
        } else if (o.constructor === String) {
          _newOverlay = new _jp.Overlays[component._jsPlumb.instance.getRenderMode()][o]({ component, _jsPlumb: component._jsPlumb.instance });
        } else {
          _newOverlay = o;
        }
        _newOverlay.id = _newOverlay.id || _ju.uuid();
        component.cacheTypeItem("overlay", _newOverlay, _newOverlay.id);
        component._jsPlumb.overlays[_newOverlay.id] = _newOverlay;
        return _newOverlay;
      };
      _jp.OverlayCapableJsPlumbUIComponent = function(params) {
        root.jsPlumbUIComponent.apply(this, arguments);
        this._jsPlumb.overlays = {};
        this._jsPlumb.overlayPositions = {};
        if (params.label) {
          this.getDefaultType().overlays[_internalLabelOverlayId] = ["Label", {
            label: params.label,
            location: params.labelLocation || this.defaultLabelLocation || 0.5,
            labelStyle: params.labelStyle || this._jsPlumb.instance.Defaults.LabelStyle,
            id: _internalLabelOverlayId
          }];
        }
        this.setListenerComponent = function(c) {
          if (this._jsPlumb) {
            for (var i in this._jsPlumb.overlays) {
              this._jsPlumb.overlays[i].setListenerComponent(c);
            }
          }
        };
      };
      _jp.OverlayCapableJsPlumbUIComponent.applyType = function(component, t) {
        if (t.overlays) {
          var keep = {}, i;
          for (i in t.overlays) {
            var existing = component._jsPlumb.overlays[t.overlays[i][1].id];
            if (existing) {
              existing.updateFrom(t.overlays[i][1]);
              keep[t.overlays[i][1].id] = true;
              existing.reattach(component._jsPlumb.instance, component);
            } else {
              var c = component.getCachedTypeItem("overlay", t.overlays[i][1].id);
              if (c != null) {
                c.reattach(component._jsPlumb.instance, component);
                c.setVisible(true);
                c.updateFrom(t.overlays[i][1]);
                component._jsPlumb.overlays[c.id] = c;
              } else {
                c = component.addOverlay(t.overlays[i], true);
              }
              keep[c.id] = true;
            }
          }
          for (i in component._jsPlumb.overlays) {
            if (keep[component._jsPlumb.overlays[i].id] == null) {
              component.removeOverlay(component._jsPlumb.overlays[i].id, true);
            }
          }
        }
      };
      _ju.extend(_jp.OverlayCapableJsPlumbUIComponent, root.jsPlumbUIComponent, {
        setHover: function(hover, ignoreAttachedElements) {
          if (this._jsPlumb && !this._jsPlumb.instance.isConnectionBeingDragged()) {
            for (var i in this._jsPlumb.overlays) {
              this._jsPlumb.overlays[i][hover ? "addClass" : "removeClass"](this._jsPlumb.instance.hoverClass);
            }
          }
        },
        addOverlay: function(overlay, doNotRepaint) {
          var o = _processOverlay(this, overlay);
          if (this.getData && o.type === "Label" && _ju.isArray(overlay)) {
            var d = this.getData(), p = overlay[1];
            if (d) {
              var locationAttribute = p.labelLocationAttribute || "labelLocation";
              var loc = d ? d[locationAttribute] : null;
              if (loc) {
                o.loc = loc;
              }
            }
          }
          if (!doNotRepaint) {
            this.repaint();
          }
          return o;
        },
        getOverlay: function(id) {
          return this._jsPlumb.overlays[id];
        },
        getOverlays: function() {
          return this._jsPlumb.overlays;
        },
        hideOverlay: function(id) {
          var o = this.getOverlay(id);
          if (o) {
            o.hide();
          }
        },
        hideOverlays: function() {
          for (var i in this._jsPlumb.overlays) {
            this._jsPlumb.overlays[i].hide();
          }
        },
        showOverlay: function(id) {
          var o = this.getOverlay(id);
          if (o) {
            o.show();
          }
        },
        showOverlays: function() {
          for (var i in this._jsPlumb.overlays) {
            this._jsPlumb.overlays[i].show();
          }
        },
        removeAllOverlays: function(doNotRepaint) {
          for (var i in this._jsPlumb.overlays) {
            if (this._jsPlumb.overlays[i].cleanup) {
              this._jsPlumb.overlays[i].cleanup();
            }
          }
          this._jsPlumb.overlays = {};
          this._jsPlumb.overlayPositions = null;
          this._jsPlumb.overlayPlacements = {};
          if (!doNotRepaint) {
            this.repaint();
          }
        },
        removeOverlay: function(overlayId, dontCleanup) {
          var o = this._jsPlumb.overlays[overlayId];
          if (o) {
            o.setVisible(false);
            if (!dontCleanup && o.cleanup) {
              o.cleanup();
            }
            delete this._jsPlumb.overlays[overlayId];
            if (this._jsPlumb.overlayPositions) {
              delete this._jsPlumb.overlayPositions[overlayId];
            }
            if (this._jsPlumb.overlayPlacements) {
              delete this._jsPlumb.overlayPlacements[overlayId];
            }
          }
        },
        removeOverlays: function() {
          for (var i = 0, j = arguments.length; i < j; i++) {
            this.removeOverlay(arguments[i]);
          }
        },
        moveParent: function(newParent) {
          if (this.bgCanvas) {
            this.bgCanvas.parentNode.removeChild(this.bgCanvas);
            newParent.appendChild(this.bgCanvas);
          }
          if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
            newParent.appendChild(this.canvas);
            for (var i in this._jsPlumb.overlays) {
              if (this._jsPlumb.overlays[i].isAppendedAtTopLevel) {
                var el = this._jsPlumb.overlays[i].getElement();
                el.parentNode.removeChild(el);
                newParent.appendChild(el);
              }
            }
          }
        },
        getLabel: function() {
          var lo = this.getOverlay(_internalLabelOverlayId);
          return lo != null ? lo.getLabel() : null;
        },
        getLabelOverlay: function() {
          return this.getOverlay(_internalLabelOverlayId);
        },
        setLabel: function(l) {
          var lo = this.getOverlay(_internalLabelOverlayId);
          if (!lo) {
            var params = l.constructor === String || l.constructor === Function ? { label: l } : l;
            lo = _makeLabelOverlay(this, params);
            this._jsPlumb.overlays[_internalLabelOverlayId] = lo;
          } else {
            if (l.constructor === String || l.constructor === Function) {
              lo.setLabel(l);
            } else {
              if (l.label) {
                lo.setLabel(l.label);
              }
              if (l.location) {
                lo.setLocation(l.location);
              }
            }
          }
          if (!this._jsPlumb.instance.isSuspendDrawing()) {
            this.repaint();
          }
        },
        cleanup: function(force) {
          for (var i in this._jsPlumb.overlays) {
            this._jsPlumb.overlays[i].cleanup(force);
            this._jsPlumb.overlays[i].destroy(force);
          }
          if (force) {
            this._jsPlumb.overlays = {};
            this._jsPlumb.overlayPositions = null;
          }
        },
        setVisible: function(v) {
          this[v ? "showOverlays" : "hideOverlays"]();
        },
        setAbsoluteOverlayPosition: function(overlay, xy) {
          this._jsPlumb.overlayPositions[overlay.id] = xy;
        },
        getAbsoluteOverlayPosition: function(overlay) {
          return this._jsPlumb.overlayPositions ? this._jsPlumb.overlayPositions[overlay.id] : null;
        },
        _clazzManip: function(action, clazz, dontUpdateOverlays) {
          if (!dontUpdateOverlays) {
            for (var i in this._jsPlumb.overlays) {
              this._jsPlumb.overlays[i][action + "Class"](clazz);
            }
          }
        },
        addClass: function(clazz, dontUpdateOverlays) {
          this._clazzManip("add", clazz, dontUpdateOverlays);
        },
        removeClass: function(clazz, dontUpdateOverlays) {
          this._clazzManip("remove", clazz, dontUpdateOverlays);
        }
      });
    }).call(typeof window !== "undefined" ? window : jsplumb);
    (function() {
      var root = this, _jp = root.jsPlumb, _ju = root.jsPlumbUtil;
      var _makeConnectionDragHandler = function(endpoint, placeholder, _jsPlumb) {
        var stopped = false;
        return {
          drag: function() {
            if (stopped) {
              stopped = false;
              return true;
            }
            if (placeholder.element) {
              var _ui = _jsPlumb.getUIPosition(arguments, _jsPlumb.getZoom());
              if (_ui != null) {
                _jsPlumb.setPosition(placeholder.element, _ui);
              }
              _jsPlumb.repaint(placeholder.element, _ui);
              endpoint.paint({ anchorPoint: endpoint.anchor.getCurrentLocation({ element: endpoint }) });
            }
          },
          stopDrag: function() {
            stopped = true;
          }
        };
      };
      var _makeDraggablePlaceholder = function(placeholder, _jsPlumb, ipco, ips) {
        var n = _jsPlumb.createElement("div", { position: "absolute" });
        _jsPlumb.appendElement(n);
        var id = _jsPlumb.getId(n);
        _jsPlumb.setPosition(n, ipco);
        n.style.width = ips[0] + "px";
        n.style.height = ips[1] + "px";
        _jsPlumb.manage(id, n, true);
        placeholder.id = id;
        placeholder.element = n;
      };
      var _makeFloatingEndpoint = function(paintStyle, referenceAnchor, endpoint, referenceCanvas, sourceElement, _jsPlumb, _newEndpoint, scope) {
        var floatingAnchor = new _jp.FloatingAnchor({ reference: referenceAnchor, referenceCanvas, jsPlumbInstance: _jsPlumb });
        return _newEndpoint({
          paintStyle,
          endpoint,
          anchor: floatingAnchor,
          source: sourceElement,
          scope
        });
      };
      var typeParameters = [
        "connectorStyle",
        "connectorHoverStyle",
        "connectorOverlays",
        "connector",
        "connectionType",
        "connectorClass",
        "connectorHoverClass"
      ];
      var findConnectionToUseForDynamicAnchor = function(ep, elementWithPrecedence) {
        var idx = 0;
        if (elementWithPrecedence != null) {
          for (var i = 0; i < ep.connections.length; i++) {
            if (ep.connections[i].sourceId === elementWithPrecedence || ep.connections[i].targetId === elementWithPrecedence) {
              idx = i;
              break;
            }
          }
        }
        return ep.connections[idx];
      };
      _jp.Endpoint = function(params) {
        var _jsPlumb = params._jsPlumb, _newConnection = params.newConnection, _newEndpoint = params.newEndpoint;
        this.idPrefix = "_jsplumb_e_";
        this.defaultLabelLocation = [0.5, 0.5];
        this.defaultOverlayKeys = ["Overlays", "EndpointOverlays"];
        _jp.OverlayCapableJsPlumbUIComponent.apply(this, arguments);
        this.appendToDefaultType({
          connectionType: params.connectionType,
          maxConnections: params.maxConnections == null ? this._jsPlumb.instance.Defaults.MaxConnections : params.maxConnections,
          // maximum number of connections this endpoint can be the source of.,
          paintStyle: params.endpointStyle || params.paintStyle || params.style || this._jsPlumb.instance.Defaults.EndpointStyle || _jp.Defaults.EndpointStyle,
          hoverPaintStyle: params.endpointHoverStyle || params.hoverPaintStyle || this._jsPlumb.instance.Defaults.EndpointHoverStyle || _jp.Defaults.EndpointHoverStyle,
          connectorStyle: params.connectorStyle,
          connectorHoverStyle: params.connectorHoverStyle,
          connectorClass: params.connectorClass,
          connectorHoverClass: params.connectorHoverClass,
          connectorOverlays: params.connectorOverlays,
          connector: params.connector,
          connectorTooltip: params.connectorTooltip
        });
        this._jsPlumb.enabled = !(params.enabled === false);
        this._jsPlumb.visible = true;
        this.element = _jp.getElement(params.source);
        this._jsPlumb.uuid = params.uuid;
        this._jsPlumb.floatingEndpoint = null;
        if (this._jsPlumb.uuid) {
          params.endpointsByUUID[this._jsPlumb.uuid] = this;
        }
        this.elementId = params.elementId;
        this.dragProxy = params.dragProxy;
        this._jsPlumb.connectionCost = params.connectionCost;
        this._jsPlumb.connectionsDirected = params.connectionsDirected;
        this._jsPlumb.currentAnchorClass = "";
        this._jsPlumb.events = {};
        var deleteOnEmpty = params.deleteOnEmpty === true;
        this.setDeleteOnEmpty = function(d) {
          deleteOnEmpty = d;
        };
        var _updateAnchorClass = (function() {
          var oldAnchorClass = _jsPlumb.endpointAnchorClassPrefix + "-" + this._jsPlumb.currentAnchorClass;
          this._jsPlumb.currentAnchorClass = this.anchor.getCssClass();
          var anchorClass = _jsPlumb.endpointAnchorClassPrefix + (this._jsPlumb.currentAnchorClass ? "-" + this._jsPlumb.currentAnchorClass : "");
          this.removeClass(oldAnchorClass);
          this.addClass(anchorClass);
          _jp.updateClasses(this.element, anchorClass, oldAnchorClass);
        }).bind(this);
        this.prepareAnchor = function(anchorParams) {
          var a = this._jsPlumb.instance.makeAnchor(anchorParams, this.elementId, _jsPlumb);
          a.bind("anchorChanged", (function(currentAnchor) {
            this.fire("anchorChanged", { endpoint: this, anchor: currentAnchor });
            _updateAnchorClass();
          }).bind(this));
          return a;
        };
        this.setPreparedAnchor = function(anchor, doNotRepaint) {
          this._jsPlumb.instance.continuousAnchorFactory.clear(this.elementId);
          this.anchor = anchor;
          _updateAnchorClass();
          if (!doNotRepaint) {
            this._jsPlumb.instance.repaint(this.elementId);
          }
          return this;
        };
        this.setAnchor = function(anchorParams, doNotRepaint) {
          var a = this.prepareAnchor(anchorParams);
          this.setPreparedAnchor(a, doNotRepaint);
          return this;
        };
        var internalHover = (function(state) {
          if (this.connections.length > 0) {
            for (var i = 0; i < this.connections.length; i++) {
              this.connections[i].setHover(state, false);
            }
          } else {
            this.setHover(state);
          }
        }).bind(this);
        this.bind("mouseover", function() {
          internalHover(true);
        });
        this.bind("mouseout", function() {
          internalHover(false);
        });
        if (!params._transient) {
          this._jsPlumb.instance.router.addEndpoint(this, this.elementId);
        }
        this.prepareEndpoint = function(ep2, typeId) {
          var _e = function(t, p) {
            var rm = _jsPlumb.getRenderMode();
            if (_jp.Endpoints[rm][t]) {
              return new _jp.Endpoints[rm][t](p);
            }
            if (!_jsPlumb.Defaults.DoNotThrowErrors) {
              throw { msg: "jsPlumb: unknown endpoint type '" + t + "'" };
            }
          };
          var endpointArgs = {
            _jsPlumb: this._jsPlumb.instance,
            cssClass: params.cssClass,
            container: params.container,
            tooltip: params.tooltip,
            connectorTooltip: params.connectorTooltip,
            endpoint: this
          };
          var endpoint;
          if (_ju.isString(ep2)) {
            endpoint = _e(ep2, endpointArgs);
          } else if (_ju.isArray(ep2)) {
            endpointArgs = _ju.merge(ep2[1], endpointArgs);
            endpoint = _e(ep2[0], endpointArgs);
          } else {
            endpoint = ep2.clone();
          }
          endpoint.clone = (function() {
            if (_ju.isString(ep2)) {
              return _e(ep2, endpointArgs);
            } else if (_ju.isArray(ep2)) {
              endpointArgs = _ju.merge(ep2[1], endpointArgs);
              return _e(ep2[0], endpointArgs);
            }
          }).bind(this);
          endpoint.typeId = typeId;
          return endpoint;
        };
        this.setEndpoint = function(ep2, doNotRepaint) {
          var _ep = this.prepareEndpoint(ep2);
          this.setPreparedEndpoint(_ep, true);
        };
        this.setPreparedEndpoint = function(ep2, doNotRepaint) {
          if (this.endpoint != null) {
            this.endpoint.cleanup();
            this.endpoint.destroy();
          }
          this.endpoint = ep2;
          this.type = this.endpoint.type;
          this.canvas = this.endpoint.canvas;
        };
        _jp.extend(this, params, typeParameters);
        this.isSource = params.isSource || false;
        this.isTemporarySource = params.isTemporarySource || false;
        this.isTarget = params.isTarget || false;
        this.connections = params.connections || [];
        this.connectorPointerEvents = params["connector-pointer-events"];
        this.scope = params.scope || _jsPlumb.getDefaultScope();
        this.timestamp = null;
        this.reattachConnections = params.reattach || _jsPlumb.Defaults.ReattachConnections;
        this.connectionsDetachable = _jsPlumb.Defaults.ConnectionsDetachable;
        if (params.connectionsDetachable === false || params.detachable === false) {
          this.connectionsDetachable = false;
        }
        this.dragAllowedWhenFull = params.dragAllowedWhenFull !== false;
        if (params.onMaxConnections) {
          this.bind("maxConnections", params.onMaxConnections);
        }
        this.addConnection = function(connection) {
          this.connections.push(connection);
          this[(this.connections.length > 0 ? "add" : "remove") + "Class"](_jsPlumb.endpointConnectedClass);
          this[(this.isFull() ? "add" : "remove") + "Class"](_jsPlumb.endpointFullClass);
        };
        this.detachFromConnection = function(connection, idx, doNotCleanup) {
          idx = idx == null ? this.connections.indexOf(connection) : idx;
          if (idx >= 0) {
            this.connections.splice(idx, 1);
            this[(this.connections.length > 0 ? "add" : "remove") + "Class"](_jsPlumb.endpointConnectedClass);
            this[(this.isFull() ? "add" : "remove") + "Class"](_jsPlumb.endpointFullClass);
          }
          if (!doNotCleanup && deleteOnEmpty && this.connections.length === 0) {
            _jsPlumb.deleteObject({
              endpoint: this,
              fireEvent: false,
              deleteAttachedObjects: doNotCleanup !== true
            });
          }
        };
        this.deleteEveryConnection = function(params2) {
          var c = this.connections.length;
          for (var i = 0; i < c; i++) {
            _jsPlumb.deleteConnection(this.connections[0], params2);
          }
        };
        this.detachFrom = function(targetEndpoint, fireEvent, originalEvent) {
          var c = [];
          for (var i = 0; i < this.connections.length; i++) {
            if (this.connections[i].endpoints[1] === targetEndpoint || this.connections[i].endpoints[0] === targetEndpoint) {
              c.push(this.connections[i]);
            }
          }
          for (var j = 0, count = c.length; j < count; j++) {
            _jsPlumb.deleteConnection(c[0]);
          }
          return this;
        };
        this.getElement = function() {
          return this.element;
        };
        this.setElement = function(el) {
          var parentId = this._jsPlumb.instance.getId(el), curId = this.elementId;
          _ju.removeWithFunction(params.endpointsByElement[this.elementId], (function(e) {
            return e.id === this.id;
          }).bind(this));
          this.element = _jp.getElement(el);
          this.elementId = _jsPlumb.getId(this.element);
          _jsPlumb.router.rehomeEndpoint(this, curId, this.element);
          _jsPlumb.dragManager.endpointAdded(this.element);
          _ju.addToList(params.endpointsByElement, parentId, this);
          return this;
        };
        this.makeInPlaceCopy = function() {
          var loc = this.anchor.getCurrentLocation({ element: this }), o = this.anchor.getOrientation(this), acc = this.anchor.getCssClass(), inPlaceAnchor = {
            bind: function() {
            },
            compute: function() {
              return [loc[0], loc[1]];
            },
            getCurrentLocation: function() {
              return [loc[0], loc[1]];
            },
            getOrientation: function() {
              return o;
            },
            getCssClass: function() {
              return acc;
            }
          };
          return _newEndpoint({
            dropOptions: params.dropOptions,
            anchor: inPlaceAnchor,
            source: this.element,
            paintStyle: this.getPaintStyle(),
            endpoint: params.hideOnDrag ? "Blank" : this.endpoint,
            _transient: true,
            scope: this.scope,
            reference: this
          });
        };
        this.connectorSelector = function() {
          return this.connections[0];
        };
        this.setStyle = this.setPaintStyle;
        this.paint = function(params2) {
          params2 = params2 || {};
          var timestamp = params2.timestamp, recalc = !(params2.recalc === false);
          if (!timestamp || this.timestamp !== timestamp) {
            var info = _jsPlumb.updateOffset({ elId: this.elementId, timestamp });
            var xy = params2.offset ? params2.offset.o : info.o;
            if (xy != null) {
              var ap = params2.anchorPoint, connectorPaintStyle = params2.connectorPaintStyle;
              if (ap == null) {
                var wh = params2.dimensions || info.s, anchorParams = { xy: [xy.left, xy.top], wh, element: this, timestamp };
                if (recalc && this.anchor.isDynamic && this.connections.length > 0) {
                  var c = findConnectionToUseForDynamicAnchor(this, params2.elementWithPrecedence), oIdx = c.endpoints[0] === this ? 1 : 0, oId = oIdx === 0 ? c.sourceId : c.targetId, oInfo = _jsPlumb.getCachedData(oId), oOffset = oInfo.o, oWH = oInfo.s;
                  anchorParams.index = oIdx === 0 ? 1 : 0;
                  anchorParams.connection = c;
                  anchorParams.txy = [oOffset.left, oOffset.top];
                  anchorParams.twh = oWH;
                  anchorParams.tElement = c.endpoints[oIdx];
                  anchorParams.tRotation = _jsPlumb.getRotation(oId);
                } else if (this.connections.length > 0) {
                  anchorParams.connection = this.connections[0];
                }
                anchorParams.rotation = _jsPlumb.getRotation(this.elementId);
                ap = this.anchor.compute(anchorParams);
              }
              this.endpoint.compute(ap, this.anchor.getOrientation(this), this._jsPlumb.paintStyleInUse, connectorPaintStyle || this.paintStyleInUse);
              this.endpoint.paint(this._jsPlumb.paintStyleInUse, this.anchor);
              this.timestamp = timestamp;
              for (var i in this._jsPlumb.overlays) {
                if (this._jsPlumb.overlays.hasOwnProperty(i)) {
                  var o = this._jsPlumb.overlays[i];
                  if (o.isVisible()) {
                    this._jsPlumb.overlayPlacements[i] = o.draw(this.endpoint, this._jsPlumb.paintStyleInUse);
                    o.paint(this._jsPlumb.overlayPlacements[i]);
                  }
                }
              }
            }
          }
        };
        this.getTypeDescriptor = function() {
          return "endpoint";
        };
        this.isVisible = function() {
          return this._jsPlumb.visible;
        };
        this.repaint = this.paint;
        var draggingInitialised = false;
        this.initDraggable = function() {
          if (!draggingInitialised && _jp.isDragSupported(this.element)) {
            var placeholderInfo = { id: null, element: null }, jpc = null, existingJpc = false, existingJpcParams = null, _dragHandler = _makeConnectionDragHandler(this, placeholderInfo, _jsPlumb), dragOptions = params.dragOptions || {}, defaultOpts = {}, startEvent = _jp.dragEvents.start, stopEvent = _jp.dragEvents.stop, dragEvent = _jp.dragEvents.drag, beforeStartEvent = _jp.dragEvents.beforeStart, payload;
            var beforeStart = function(beforeStartParams) {
              payload = beforeStartParams.e.payload || {};
            };
            var start = (function(startParams) {
              jpc = this.connectorSelector();
              var _continue = true;
              if (!this.isEnabled()) {
                _continue = false;
              }
              if (jpc == null && !this.isSource && !this.isTemporarySource) {
                _continue = false;
              }
              if (this.isSource && this.isFull() && !(jpc != null && this.dragAllowedWhenFull)) {
                _continue = false;
              }
              if (jpc != null && !jpc.isDetachable(this)) {
                if (this.isFull()) {
                  _continue = false;
                } else {
                  jpc = null;
                }
              }
              var beforeDrag = _jsPlumb.checkCondition(jpc == null ? "beforeDrag" : "beforeStartDetach", {
                endpoint: this,
                source: this.element,
                sourceId: this.elementId,
                connection: jpc
              });
              if (beforeDrag === false) {
                _continue = false;
              } else if (typeof beforeDrag === "object") {
                _jp.extend(beforeDrag, payload || {});
              } else {
                beforeDrag = payload || {};
              }
              if (_continue === false) {
                if (_jsPlumb.stopDrag) {
                  _jsPlumb.stopDrag(this.canvas);
                }
                _dragHandler.stopDrag();
                return false;
              }
              for (var i = 0; i < this.connections.length; i++) {
                this.connections[i].setHover(false);
              }
              this.addClass("endpointDrag");
              _jsPlumb.setConnectionBeingDragged(true);
              if (jpc && !this.isFull() && this.isSource) {
                jpc = null;
              }
              _jsPlumb.updateOffset({ elId: this.elementId });
              var ipco = this._jsPlumb.instance.getOffset(this.canvas), canvasElement = this.canvas, ips = this._jsPlumb.instance.getSize(this.canvas);
              _makeDraggablePlaceholder(placeholderInfo, _jsPlumb, ipco, ips);
              _jsPlumb.setAttributes(this.canvas, {
                "dragId": placeholderInfo.id,
                "elId": this.elementId
              });
              var endpointToFloat = this.dragProxy || this.endpoint;
              if (this.dragProxy == null && this.connectionType != null) {
                var aae = this._jsPlumb.instance.deriveEndpointAndAnchorSpec(this.connectionType);
                if (aae.endpoints[1]) {
                  endpointToFloat = aae.endpoints[1];
                }
              }
              var centerAnchor = this._jsPlumb.instance.makeAnchor("Center");
              centerAnchor.isFloating = true;
              this._jsPlumb.floatingEndpoint = _makeFloatingEndpoint(this.getPaintStyle(), centerAnchor, endpointToFloat, this.canvas, placeholderInfo.element, _jsPlumb, _newEndpoint, this.scope);
              var _savedAnchor = this._jsPlumb.floatingEndpoint.anchor;
              if (jpc == null) {
                this.setHover(false, false);
                jpc = _newConnection({
                  sourceEndpoint: this,
                  targetEndpoint: this._jsPlumb.floatingEndpoint,
                  source: this.element,
                  // for makeSource with parent option.  ensure source element is represented correctly.
                  target: placeholderInfo.element,
                  anchors: [this.anchor, this._jsPlumb.floatingEndpoint.anchor],
                  paintStyle: params.connectorStyle,
                  // this can be null. Connection will use the default.
                  hoverPaintStyle: params.connectorHoverStyle,
                  connector: params.connector,
                  // this can also be null. Connection will use the default.
                  overlays: params.connectorOverlays,
                  type: this.connectionType,
                  cssClass: this.connectorClass,
                  hoverClass: this.connectorHoverClass,
                  scope: params.scope,
                  data: beforeDrag
                });
                jpc.pending = true;
                jpc.addClass(_jsPlumb.draggingClass);
                this._jsPlumb.floatingEndpoint.addClass(_jsPlumb.draggingClass);
                this._jsPlumb.floatingEndpoint.anchor = _savedAnchor;
                _jsPlumb.fire("connectionDrag", jpc);
                _jsPlumb.router.newConnection(jpc);
              } else {
                existingJpc = true;
                jpc.setHover(false);
                var anchorIdx = jpc.endpoints[0].id === this.id ? 0 : 1;
                this.detachFromConnection(jpc, null, true);
                var dragScope = _jsPlumb.getDragScope(canvasElement);
                _jsPlumb.setAttribute(this.canvas, "originalScope", dragScope);
                _jsPlumb.fire("connectionDrag", jpc);
                if (anchorIdx === 0) {
                  existingJpcParams = [jpc.source, jpc.sourceId, canvasElement, dragScope];
                  _jsPlumb.router.sourceOrTargetChanged(jpc.endpoints[anchorIdx].elementId, placeholderInfo.id, jpc, placeholderInfo.element, 0);
                } else {
                  existingJpcParams = [jpc.target, jpc.targetId, canvasElement, dragScope];
                  _jsPlumb.router.sourceOrTargetChanged(jpc.endpoints[anchorIdx].elementId, placeholderInfo.id, jpc, placeholderInfo.element, 1);
                }
                jpc.suspendedEndpoint = jpc.endpoints[anchorIdx];
                jpc.suspendedElement = jpc.endpoints[anchorIdx].getElement();
                jpc.suspendedElementId = jpc.endpoints[anchorIdx].elementId;
                jpc.suspendedElementType = anchorIdx === 0 ? "source" : "target";
                jpc.suspendedEndpoint.setHover(false);
                this._jsPlumb.floatingEndpoint.referenceEndpoint = jpc.suspendedEndpoint;
                jpc.endpoints[anchorIdx] = this._jsPlumb.floatingEndpoint;
                jpc.addClass(_jsPlumb.draggingClass);
                this._jsPlumb.floatingEndpoint.addClass(_jsPlumb.draggingClass);
              }
              _jsPlumb.registerFloatingConnection(placeholderInfo, jpc, this._jsPlumb.floatingEndpoint);
              _jsPlumb.currentlyDragging = true;
            }).bind(this);
            var stop = (function() {
              _jsPlumb.setConnectionBeingDragged(false);
              if (jpc && jpc.endpoints != null) {
                var originalEvent = _jsPlumb.getDropEvent(arguments);
                var idx = _jsPlumb.getFloatingAnchorIndex(jpc);
                jpc.endpoints[idx === 0 ? 1 : 0].anchor.locked = false;
                jpc.removeClass(_jsPlumb.draggingClass);
                if (this._jsPlumb && (jpc.deleteConnectionNow || jpc.endpoints[idx] === this._jsPlumb.floatingEndpoint)) {
                  if (existingJpc && jpc.suspendedEndpoint) {
                    if (idx === 0) {
                      jpc.floatingElement = jpc.source;
                      jpc.floatingId = jpc.sourceId;
                      jpc.floatingEndpoint = jpc.endpoints[0];
                      jpc.floatingIndex = 0;
                      jpc.source = existingJpcParams[0];
                      jpc.sourceId = existingJpcParams[1];
                    } else {
                      jpc.floatingElement = jpc.target;
                      jpc.floatingId = jpc.targetId;
                      jpc.floatingEndpoint = jpc.endpoints[1];
                      jpc.floatingIndex = 1;
                      jpc.target = existingJpcParams[0];
                      jpc.targetId = existingJpcParams[1];
                    }
                    var fe = this._jsPlumb.floatingEndpoint;
                    _jsPlumb.setDragScope(existingJpcParams[2], existingJpcParams[3]);
                    jpc.endpoints[idx] = jpc.suspendedEndpoint;
                    if (jpc.isReattach() || jpc._forceReattach || jpc._forceDetach || !_jsPlumb.deleteConnection(jpc, { originalEvent })) {
                      jpc.setHover(false);
                      jpc._forceDetach = null;
                      jpc._forceReattach = null;
                      this._jsPlumb.floatingEndpoint.detachFromConnection(jpc);
                      jpc.suspendedEndpoint.addConnection(jpc);
                      if (idx === 1) {
                        _jsPlumb.router.sourceOrTargetChanged(jpc.floatingId, jpc.targetId, jpc, jpc.target, idx);
                      } else {
                        _jsPlumb.router.sourceOrTargetChanged(jpc.floatingId, jpc.sourceId, jpc, jpc.source, idx);
                      }
                      _jsPlumb.repaint(existingJpcParams[1]);
                    } else {
                      _jsPlumb.deleteObject({ endpoint: fe });
                    }
                  }
                }
                if (this.deleteAfterDragStop) {
                  _jsPlumb.deleteObject({ endpoint: this });
                } else {
                  if (this._jsPlumb) {
                    this.paint({ recalc: false });
                  }
                }
                _jsPlumb.fire("connectionDragStop", jpc, originalEvent);
                if (jpc.pending) {
                  _jsPlumb.fire("connectionAborted", jpc, originalEvent);
                }
                _jsPlumb.currentlyDragging = false;
                jpc.suspendedElement = null;
                jpc.suspendedEndpoint = null;
                jpc = null;
              }
              if (placeholderInfo && placeholderInfo.element) {
                _jsPlumb.remove(placeholderInfo.element, false, false);
              }
              if (this._jsPlumb) {
                this.canvas.style.visibility = "visible";
                this.anchor.locked = false;
                this._jsPlumb.floatingEndpoint = null;
              }
            }).bind(this);
            dragOptions = _jp.extend(defaultOpts, dragOptions);
            dragOptions.scope = this.scope || dragOptions.scope;
            dragOptions[beforeStartEvent] = _ju.wrap(dragOptions[beforeStartEvent], beforeStart, false);
            dragOptions[startEvent] = _ju.wrap(dragOptions[startEvent], start, false);
            dragOptions[dragEvent] = _ju.wrap(dragOptions[dragEvent], _dragHandler.drag);
            dragOptions[stopEvent] = _ju.wrap(dragOptions[stopEvent], stop);
            dragOptions.multipleDrop = false;
            dragOptions.canDrag = (function() {
              return this.isSource || this.isTemporarySource || this.connections.length > 0 && this.connectionsDetachable !== false;
            }).bind(this);
            _jsPlumb.initDraggable(this.canvas, dragOptions, "internal");
            this.canvas._jsPlumbRelatedElement = this.element;
            draggingInitialised = true;
          }
        };
        var ep = params.endpoint || this._jsPlumb.instance.Defaults.Endpoint || _jp.Defaults.Endpoint;
        this.setEndpoint(ep, true);
        var anchorParamsToUse = params.anchor ? params.anchor : params.anchors ? params.anchors : _jsPlumb.Defaults.Anchor || "Top";
        this.setAnchor(anchorParamsToUse, true);
        var type = ["default", params.type || ""].join(" ");
        this.addType(type, params.data, true);
        this.canvas = this.endpoint.canvas;
        this.canvas._jsPlumb = this;
        this.initDraggable();
        var _initDropTarget = (function(canvas, isTransient, endpoint, referenceEndpoint) {
          if (_jp.isDropSupported(this.element)) {
            var dropOptions = params.dropOptions || _jsPlumb.Defaults.DropOptions || _jp.Defaults.DropOptions;
            dropOptions = _jp.extend({}, dropOptions);
            dropOptions.scope = dropOptions.scope || this.scope;
            var dropEvent = _jp.dragEvents.drop, overEvent = _jp.dragEvents.over, outEvent = _jp.dragEvents.out, _ep = this, drop = _jsPlumb.EndpointDropHandler({
              getEndpoint: function() {
                return _ep;
              },
              jsPlumb: _jsPlumb,
              enabled: function() {
                return endpoint != null ? endpoint.isEnabled() : true;
              },
              isFull: function() {
                return endpoint.isFull();
              },
              element: this.element,
              elementId: this.elementId,
              isSource: this.isSource,
              isTarget: this.isTarget,
              addClass: function(clazz) {
                _ep.addClass(clazz);
              },
              removeClass: function(clazz) {
                _ep.removeClass(clazz);
              },
              isDropAllowed: function() {
                return _ep.isDropAllowed.apply(_ep, arguments);
              },
              reference: referenceEndpoint,
              isRedrop: function(jpc, dhParams) {
                return jpc.suspendedEndpoint && dhParams.reference && jpc.suspendedEndpoint.id === dhParams.reference.id;
              }
            });
            dropOptions[dropEvent] = _ju.wrap(dropOptions[dropEvent], drop, true);
            dropOptions[overEvent] = _ju.wrap(dropOptions[overEvent], (function() {
              var draggable = _jp.getDragObject(arguments), id = _jsPlumb.getAttribute(_jp.getElement(draggable), "dragId"), _jpc = _jsPlumb.getFloatingConnectionFor(id);
              if (_jpc != null) {
                var idx = _jsPlumb.getFloatingAnchorIndex(_jpc);
                var _cont = this.isTarget && idx !== 0 || _jpc.suspendedEndpoint && this.referenceEndpoint && this.referenceEndpoint.id === _jpc.suspendedEndpoint.id;
                if (_cont) {
                  var bb = _jsPlumb.checkCondition("checkDropAllowed", {
                    sourceEndpoint: _jpc.endpoints[idx],
                    targetEndpoint: this,
                    connection: _jpc
                  });
                  this[(bb ? "add" : "remove") + "Class"](_jsPlumb.endpointDropAllowedClass);
                  this[(bb ? "remove" : "add") + "Class"](_jsPlumb.endpointDropForbiddenClass);
                  _jpc.endpoints[idx].anchor.over(this.anchor, this);
                }
              }
            }).bind(this));
            dropOptions[outEvent] = _ju.wrap(dropOptions[outEvent], (function() {
              var draggable = _jp.getDragObject(arguments), id = draggable == null ? null : _jsPlumb.getAttribute(_jp.getElement(draggable), "dragId"), _jpc = id ? _jsPlumb.getFloatingConnectionFor(id) : null;
              if (_jpc != null) {
                var idx = _jsPlumb.getFloatingAnchorIndex(_jpc);
                var _cont = this.isTarget && idx !== 0 || _jpc.suspendedEndpoint && this.referenceEndpoint && this.referenceEndpoint.id === _jpc.suspendedEndpoint.id;
                if (_cont) {
                  this.removeClass(_jsPlumb.endpointDropAllowedClass);
                  this.removeClass(_jsPlumb.endpointDropForbiddenClass);
                  _jpc.endpoints[idx].anchor.out();
                }
              }
            }).bind(this));
            _jsPlumb.initDroppable(canvas, dropOptions, "internal", isTransient);
          }
        }).bind(this);
        if (!this.anchor.isFloating) {
          _initDropTarget(this.canvas, !(params._transient || this.anchor.isFloating), this, params.reference);
        }
        return this;
      };
      _ju.extend(_jp.Endpoint, _jp.OverlayCapableJsPlumbUIComponent, {
        setVisible: function(v, doNotChangeConnections, doNotNotifyOtherEndpoint) {
          this._jsPlumb.visible = v;
          if (this.canvas) {
            this.canvas.style.display = v ? "block" : "none";
          }
          this[v ? "showOverlays" : "hideOverlays"]();
          if (!doNotChangeConnections) {
            for (var i = 0; i < this.connections.length; i++) {
              this.connections[i].setVisible(v);
              if (!doNotNotifyOtherEndpoint) {
                var oIdx = this === this.connections[i].endpoints[0] ? 1 : 0;
                if (this.connections[i].endpoints[oIdx].connections.length === 1) {
                  this.connections[i].endpoints[oIdx].setVisible(v, true, true);
                }
              }
            }
          }
        },
        getAttachedElements: function() {
          return this.connections;
        },
        applyType: function(t, doNotRepaint) {
          this.setPaintStyle(t.endpointStyle || t.paintStyle, doNotRepaint);
          this.setHoverPaintStyle(t.endpointHoverStyle || t.hoverPaintStyle, doNotRepaint);
          if (t.maxConnections != null) {
            this._jsPlumb.maxConnections = t.maxConnections;
          }
          if (t.scope) {
            this.scope = t.scope;
          }
          _jp.extend(this, t, typeParameters);
          if (t.cssClass != null && this.canvas) {
            this._jsPlumb.instance.addClass(this.canvas, t.cssClass);
          }
          _jp.OverlayCapableJsPlumbUIComponent.applyType(this, t);
        },
        isEnabled: function() {
          return this._jsPlumb.enabled;
        },
        setEnabled: function(e) {
          this._jsPlumb.enabled = e;
        },
        cleanup: function() {
          var anchorClass = this._jsPlumb.instance.endpointAnchorClassPrefix + (this._jsPlumb.currentAnchorClass ? "-" + this._jsPlumb.currentAnchorClass : "");
          _jp.removeClass(this.element, anchorClass);
          this.anchor = null;
          this.endpoint.cleanup(true);
          this.endpoint.destroy();
          this.endpoint = null;
          this._jsPlumb.instance.destroyDraggable(this.canvas, "internal");
          this._jsPlumb.instance.destroyDroppable(this.canvas, "internal");
        },
        setHover: function(h) {
          if (this.endpoint && this._jsPlumb && !this._jsPlumb.instance.isConnectionBeingDragged()) {
            this.endpoint.setHover(h);
          }
        },
        isFull: function() {
          return this._jsPlumb.maxConnections === 0 ? true : !(this.isFloating() || this._jsPlumb.maxConnections < 0 || this.connections.length < this._jsPlumb.maxConnections);
        },
        /**
         * private but needs to be exposed.
         */
        isFloating: function() {
          return this.anchor != null && this.anchor.isFloating;
        },
        isConnectedTo: function(endpoint) {
          var found = false;
          if (endpoint) {
            for (var i = 0; i < this.connections.length; i++) {
              if (this.connections[i].endpoints[1] === endpoint || this.connections[i].endpoints[0] === endpoint) {
                found = true;
                break;
              }
            }
          }
          return found;
        },
        getConnectionCost: function() {
          return this._jsPlumb.connectionCost;
        },
        setConnectionCost: function(c) {
          this._jsPlumb.connectionCost = c;
        },
        areConnectionsDirected: function() {
          return this._jsPlumb.connectionsDirected;
        },
        setConnectionsDirected: function(b) {
          this._jsPlumb.connectionsDirected = b;
        },
        setElementId: function(_elId) {
          this.elementId = _elId;
          this.anchor.elementId = _elId;
        },
        setReferenceElement: function(_el) {
          this.element = _jp.getElement(_el);
        },
        setDragAllowedWhenFull: function(allowed) {
          this.dragAllowedWhenFull = allowed;
        },
        equals: function(endpoint) {
          return this.anchor.equals(endpoint.anchor);
        },
        getUuid: function() {
          return this._jsPlumb.uuid;
        },
        computeAnchor: function(params) {
          return this.anchor.compute(params);
        }
      });
      root.jsPlumbInstance.prototype.EndpointDropHandler = function(dhParams) {
        return function(e) {
          var _jsPlumb = dhParams.jsPlumb;
          dhParams.removeClass(_jsPlumb.endpointDropAllowedClass);
          dhParams.removeClass(_jsPlumb.endpointDropForbiddenClass);
          var originalEvent = _jsPlumb.getDropEvent(arguments), draggable = _jsPlumb.getDragObject(arguments), id = _jsPlumb.getAttribute(draggable, "dragId");
          _jsPlumb.getAttribute(draggable, "elId");
          var scope = _jsPlumb.getAttribute(draggable, "originalScope"), jpc = _jsPlumb.getFloatingConnectionFor(id);
          if (jpc == null) {
            return;
          }
          var existingConnection = jpc.suspendedEndpoint != null;
          if (existingConnection && jpc.suspendedEndpoint._jsPlumb == null) {
            return;
          }
          var _ep = dhParams.getEndpoint(jpc);
          if (_ep == null) {
            return;
          }
          if (dhParams.isRedrop(jpc, dhParams)) {
            jpc._forceReattach = true;
            jpc.setHover(false);
            if (dhParams.maybeCleanup) {
              dhParams.maybeCleanup(_ep);
            }
            return;
          }
          var idx = _jsPlumb.getFloatingAnchorIndex(jpc);
          if (idx === 0 && !dhParams.isSource || idx === 1 && !dhParams.isTarget) {
            if (dhParams.maybeCleanup) {
              dhParams.maybeCleanup(_ep);
            }
            return;
          }
          if (dhParams.onDrop) {
            dhParams.onDrop(jpc);
          }
          if (scope) {
            _jsPlumb.setDragScope(draggable, scope);
          }
          var isFull = dhParams.isFull(e);
          if (isFull) {
            _ep.fire("maxConnections", {
              endpoint: this,
              connection: jpc,
              maxConnections: _ep._jsPlumb.maxConnections
            }, originalEvent);
          }
          if (!isFull && dhParams.enabled()) {
            var _doContinue = true;
            if (idx === 0) {
              jpc.floatingElement = jpc.source;
              jpc.floatingId = jpc.sourceId;
              jpc.floatingEndpoint = jpc.endpoints[0];
              jpc.floatingIndex = 0;
              jpc.source = dhParams.element;
              jpc.sourceId = _jsPlumb.getId(dhParams.element);
            } else {
              jpc.floatingElement = jpc.target;
              jpc.floatingId = jpc.targetId;
              jpc.floatingEndpoint = jpc.endpoints[1];
              jpc.floatingIndex = 1;
              jpc.target = dhParams.element;
              jpc.targetId = _jsPlumb.getId(dhParams.element);
            }
            if (existingConnection && jpc.suspendedEndpoint.id !== _ep.id) {
              if (!jpc.isDetachAllowed(jpc) || !jpc.endpoints[idx].isDetachAllowed(jpc) || !jpc.suspendedEndpoint.isDetachAllowed(jpc) || !_jsPlumb.checkCondition("beforeDetach", jpc)) {
                _doContinue = false;
              }
            }
            var continueFunction = (function(optionalData) {
              jpc.endpoints[idx].detachFromConnection(jpc);
              if (jpc.suspendedEndpoint) {
                jpc.suspendedEndpoint.detachFromConnection(jpc);
              }
              jpc.endpoints[idx] = _ep;
              _ep.addConnection(jpc);
              var params = _ep.getParameters();
              for (var aParam in params) {
                jpc.setParameter(aParam, params[aParam]);
              }
              if (!existingConnection) {
                if (params.draggable) {
                  _jsPlumb.initDraggable(this.element, dhParams.dragOptions, "internal", _jsPlumb);
                }
              } else {
                var suspendedElementId = jpc.suspendedEndpoint.elementId;
                _jsPlumb.fireMoveEvent({
                  index: idx,
                  originalSourceId: idx === 0 ? suspendedElementId : jpc.sourceId,
                  newSourceId: idx === 0 ? _ep.elementId : jpc.sourceId,
                  originalTargetId: idx === 1 ? suspendedElementId : jpc.targetId,
                  newTargetId: idx === 1 ? _ep.elementId : jpc.targetId,
                  originalSourceEndpoint: idx === 0 ? jpc.suspendedEndpoint : jpc.endpoints[0],
                  newSourceEndpoint: idx === 0 ? _ep : jpc.endpoints[0],
                  originalTargetEndpoint: idx === 1 ? jpc.suspendedEndpoint : jpc.endpoints[1],
                  newTargetEndpoint: idx === 1 ? _ep : jpc.endpoints[1],
                  connection: jpc
                }, originalEvent);
              }
              if (idx === 1) {
                _jsPlumb.router.sourceOrTargetChanged(jpc.floatingId, jpc.targetId, jpc, jpc.target, 1);
              } else {
                _jsPlumb.router.sourceOrTargetChanged(jpc.floatingId, jpc.sourceId, jpc, jpc.source, 0);
              }
              if (jpc.endpoints[0].finalEndpoint) {
                var _toDelete = jpc.endpoints[0];
                _toDelete.detachFromConnection(jpc);
                jpc.endpoints[0] = jpc.endpoints[0].finalEndpoint;
                jpc.endpoints[0].addConnection(jpc);
              }
              if (_ju.isObject(optionalData)) {
                jpc.mergeData(optionalData);
              }
              _jsPlumb.finaliseConnection(jpc, null, originalEvent, false);
              jpc.setHover(false);
              _jsPlumb.revalidate(jpc.endpoints[0].element);
            }).bind(this);
            var dontContinueFunction = function() {
              if (jpc.suspendedEndpoint) {
                jpc.endpoints[idx] = jpc.suspendedEndpoint;
                jpc.setHover(false);
                jpc._forceDetach = true;
                if (idx === 0) {
                  jpc.source = jpc.suspendedEndpoint.element;
                  jpc.sourceId = jpc.suspendedEndpoint.elementId;
                } else {
                  jpc.target = jpc.suspendedEndpoint.element;
                  jpc.targetId = jpc.suspendedEndpoint.elementId;
                }
                jpc.suspendedEndpoint.addConnection(jpc);
                if (idx === 1) {
                  _jsPlumb.router.sourceOrTargetChanged(jpc.floatingId, jpc.targetId, jpc, jpc.target, 1);
                } else {
                  _jsPlumb.router.sourceOrTargetChanged(jpc.floatingId, jpc.sourceId, jpc, jpc.source, 0);
                }
                _jsPlumb.repaint(jpc.sourceId);
                jpc._forceDetach = false;
              }
            };
            _doContinue = _doContinue && dhParams.isDropAllowed(jpc.sourceId, jpc.targetId, jpc.scope, jpc, _ep);
            if (_doContinue) {
              continueFunction(_doContinue);
              return true;
            } else {
              dontContinueFunction();
            }
          }
          if (dhParams.maybeCleanup) {
            dhParams.maybeCleanup(_ep);
          }
          _jsPlumb.currentlyDragging = false;
        };
      };
    }).call(typeof window !== "undefined" ? window : jsplumb);
    (function() {
      var root = this, _jp = root.jsPlumb, _ju = root.jsPlumbUtil;
      var makeConnector = function(_jsPlumb, renderMode, connectorName, connectorArgs, forComponent) {
        _jp.Connectors[renderMode] = _jp.Connectors[renderMode] || {};
        if (_jp.Connectors[renderMode][connectorName] == null) {
          if (_jp.Connectors[connectorName] == null) {
            if (!_jsPlumb.Defaults.DoNotThrowErrors) {
              throw new TypeError("jsPlumb: unknown connector type '" + connectorName + "'");
            } else {
              return null;
            }
          }
          _jp.Connectors[renderMode][connectorName] = function() {
            _jp.Connectors[connectorName].apply(this, arguments);
            _jp.ConnectorRenderers[renderMode].apply(this, arguments);
          };
          _ju.extend(_jp.Connectors[renderMode][connectorName], [_jp.Connectors[connectorName], _jp.ConnectorRenderers[renderMode]]);
        }
        return new _jp.Connectors[renderMode][connectorName](connectorArgs, forComponent);
      }, _makeAnchor = function(anchorParams, elementId, _jsPlumb) {
        return anchorParams ? _jsPlumb.makeAnchor(anchorParams, elementId, _jsPlumb) : null;
      }, _updateConnectedClass = function(conn, element, _jsPlumb, remove) {
        if (element != null) {
          element._jsPlumbConnections = element._jsPlumbConnections || {};
          if (remove) {
            delete element._jsPlumbConnections[conn.id];
          } else {
            element._jsPlumbConnections[conn.id] = true;
          }
          if (_ju.isEmpty(element._jsPlumbConnections)) {
            _jsPlumb.removeClass(element, _jsPlumb.connectedClass);
          } else {
            _jsPlumb.addClass(element, _jsPlumb.connectedClass);
          }
        }
      };
      _jp.Connection = function(params) {
        var _newEndpoint = params.newEndpoint;
        this.id = params.id;
        this.connector = null;
        this.idPrefix = "_jsplumb_c_";
        this.defaultLabelLocation = 0.5;
        this.defaultOverlayKeys = ["Overlays", "ConnectionOverlays"];
        this.previousConnection = params.previousConnection;
        this.source = _jp.getElement(params.source);
        this.target = _jp.getElement(params.target);
        _jp.OverlayCapableJsPlumbUIComponent.apply(this, arguments);
        if (params.sourceEndpoint) {
          this.source = params.sourceEndpoint.getElement();
          this.sourceId = params.sourceEndpoint.elementId;
        } else {
          this.sourceId = this._jsPlumb.instance.getId(this.source);
        }
        if (params.targetEndpoint) {
          this.target = params.targetEndpoint.getElement();
          this.targetId = params.targetEndpoint.elementId;
        } else {
          this.targetId = this._jsPlumb.instance.getId(this.target);
        }
        this.scope = params.scope;
        this.endpoints = [];
        this.endpointStyles = [];
        var _jsPlumb = this._jsPlumb.instance;
        _jsPlumb.manage(this.sourceId, this.source);
        _jsPlumb.manage(this.targetId, this.target);
        this._jsPlumb.visible = true;
        this._jsPlumb.params = {
          cssClass: params.cssClass,
          container: params.container,
          "pointer-events": params["pointer-events"],
          editorParams: params.editorParams,
          overlays: params.overlays
        };
        this._jsPlumb.lastPaintedAt = null;
        this.bind("mouseover", (function() {
          this.setHover(true);
        }).bind(this));
        this.bind("mouseout", (function() {
          this.setHover(false);
        }).bind(this));
        this.makeEndpoint = function(isSource, el, elId, ep, definition) {
          elId = elId || this._jsPlumb.instance.getId(el);
          return this.prepareEndpoint(_jsPlumb, _newEndpoint, this, ep, isSource ? 0 : 1, params, el, elId, definition);
        };
        if (params.type) {
          params.endpoints = params.endpoints || this._jsPlumb.instance.deriveEndpointAndAnchorSpec(params.type).endpoints;
        }
        var eS = this.makeEndpoint(true, this.source, this.sourceId, params.sourceEndpoint), eT = this.makeEndpoint(false, this.target, this.targetId, params.targetEndpoint);
        if (eS) {
          _ju.addToList(params.endpointsByElement, this.sourceId, eS);
        }
        if (eT) {
          _ju.addToList(params.endpointsByElement, this.targetId, eT);
        }
        if (!this.scope) {
          this.scope = this.endpoints[0].scope;
        }
        if (params.deleteEndpointsOnEmpty != null) {
          this.endpoints[0].setDeleteOnEmpty(params.deleteEndpointsOnEmpty);
          this.endpoints[1].setDeleteOnEmpty(params.deleteEndpointsOnEmpty);
        }
        var _detachable = _jsPlumb.Defaults.ConnectionsDetachable;
        if (params.detachable === false) {
          _detachable = false;
        }
        if (this.endpoints[0].connectionsDetachable === false) {
          _detachable = false;
        }
        if (this.endpoints[1].connectionsDetachable === false) {
          _detachable = false;
        }
        var _reattach = params.reattach || this.endpoints[0].reattachConnections || this.endpoints[1].reattachConnections || _jsPlumb.Defaults.ReattachConnections;
        this.appendToDefaultType({
          detachable: _detachable,
          reattach: _reattach,
          paintStyle: this.endpoints[0].connectorStyle || this.endpoints[1].connectorStyle || params.paintStyle || _jsPlumb.Defaults.PaintStyle || _jp.Defaults.PaintStyle,
          hoverPaintStyle: this.endpoints[0].connectorHoverStyle || this.endpoints[1].connectorHoverStyle || params.hoverPaintStyle || _jsPlumb.Defaults.HoverPaintStyle || _jp.Defaults.HoverPaintStyle
        });
        var _suspendedAt = _jsPlumb.getSuspendedAt();
        if (!_jsPlumb.isSuspendDrawing()) {
          var myInfo = _jsPlumb.getCachedData(this.sourceId), myOffset = myInfo.o, myWH = myInfo.s, otherInfo = _jsPlumb.getCachedData(this.targetId), otherOffset = otherInfo.o, otherWH = otherInfo.s, initialTimestamp = _suspendedAt || jsPlumbUtil.uuid(), anchorLoc = this.endpoints[0].anchor.compute({
            xy: [myOffset.left, myOffset.top],
            wh: myWH,
            element: this.endpoints[0],
            elementId: this.endpoints[0].elementId,
            txy: [otherOffset.left, otherOffset.top],
            twh: otherWH,
            tElement: this.endpoints[1],
            timestamp: initialTimestamp,
            rotation: _jsPlumb.getRotation(this.endpoints[0].elementId)
          });
          this.endpoints[0].paint({ anchorLoc, timestamp: initialTimestamp });
          anchorLoc = this.endpoints[1].anchor.compute({
            xy: [otherOffset.left, otherOffset.top],
            wh: otherWH,
            element: this.endpoints[1],
            elementId: this.endpoints[1].elementId,
            txy: [myOffset.left, myOffset.top],
            twh: myWH,
            tElement: this.endpoints[0],
            timestamp: initialTimestamp,
            rotation: _jsPlumb.getRotation(this.endpoints[1].elementId)
          });
          this.endpoints[1].paint({ anchorLoc, timestamp: initialTimestamp });
        }
        this.getTypeDescriptor = function() {
          return "connection";
        };
        this.getAttachedElements = function() {
          return this.endpoints;
        };
        this.isDetachable = function(ep) {
          return this._jsPlumb.detachable === false ? false : ep != null ? ep.connectionsDetachable === true : this._jsPlumb.detachable === true;
        };
        this.setDetachable = function(detachable) {
          this._jsPlumb.detachable = detachable === true;
        };
        this.isReattach = function() {
          return this._jsPlumb.reattach === true || this.endpoints[0].reattachConnections === true || this.endpoints[1].reattachConnections === true;
        };
        this.setReattach = function(reattach) {
          this._jsPlumb.reattach = reattach === true;
        };
        this._jsPlumb.cost = params.cost || this.endpoints[0].getConnectionCost();
        this._jsPlumb.directed = params.directed;
        if (params.directed == null) {
          this._jsPlumb.directed = this.endpoints[0].areConnectionsDirected();
        }
        var _p = _jp.extend({}, this.endpoints[1].getParameters());
        _jp.extend(_p, this.endpoints[0].getParameters());
        _jp.extend(_p, this.getParameters());
        this.setParameters(_p);
        this.setConnector(this.endpoints[0].connector || this.endpoints[1].connector || params.connector || _jsPlumb.Defaults.Connector || _jp.Defaults.Connector, true);
        var data = params.data == null || !_ju.isObject(params.data) ? {} : params.data;
        this.getData = function() {
          return data;
        };
        this.setData = function(d) {
          data = d || {};
        };
        this.mergeData = function(d) {
          data = _jp.extend(data, d);
        };
        var _types = ["default", this.endpoints[0].connectionType, this.endpoints[1].connectionType, params.type].join(" ");
        if (/[^\s]/.test(_types)) {
          this.addType(_types, params.data, true);
        }
        this.updateConnectedClass();
      };
      _ju.extend(_jp.Connection, _jp.OverlayCapableJsPlumbUIComponent, {
        applyType: function(t, doNotRepaint, typeMap) {
          var _connector = null;
          if (t.connector != null) {
            _connector = this.getCachedTypeItem("connector", typeMap.connector);
            if (_connector == null) {
              _connector = this.prepareConnector(t.connector, typeMap.connector);
              this.cacheTypeItem("connector", _connector, typeMap.connector);
            }
            this.setPreparedConnector(_connector);
          }
          if (t.detachable != null) {
            this.setDetachable(t.detachable);
          }
          if (t.reattach != null) {
            this.setReattach(t.reattach);
          }
          if (t.scope) {
            this.scope = t.scope;
          }
          if (t.cssClass != null && this.canvas) {
            this._jsPlumb.instance.addClass(this.canvas, t.cssClass);
          }
          var _anchors = null;
          if (t.anchor) {
            _anchors = this.getCachedTypeItem("anchors", typeMap.anchor);
            if (_anchors == null) {
              _anchors = [this._jsPlumb.instance.makeAnchor(t.anchor), this._jsPlumb.instance.makeAnchor(t.anchor)];
              this.cacheTypeItem("anchors", _anchors, typeMap.anchor);
            }
          } else if (t.anchors) {
            _anchors = this.getCachedTypeItem("anchors", typeMap.anchors);
            if (_anchors == null) {
              _anchors = [
                this._jsPlumb.instance.makeAnchor(t.anchors[0]),
                this._jsPlumb.instance.makeAnchor(t.anchors[1])
              ];
              this.cacheTypeItem("anchors", _anchors, typeMap.anchors);
            }
          }
          if (_anchors != null) {
            this.endpoints[0].anchor = _anchors[0];
            this.endpoints[1].anchor = _anchors[1];
            if (this.endpoints[1].anchor.isDynamic) {
              this._jsPlumb.instance.repaint(this.endpoints[1].elementId);
            }
          }
          _jp.OverlayCapableJsPlumbUIComponent.applyType(this, t);
        },
        addClass: function(c, informEndpoints) {
          if (informEndpoints) {
            this.endpoints[0].addClass(c);
            this.endpoints[1].addClass(c);
            if (this.suspendedEndpoint) {
              this.suspendedEndpoint.addClass(c);
            }
          }
          if (this.connector) {
            this.connector.addClass(c);
          }
        },
        removeClass: function(c, informEndpoints) {
          if (informEndpoints) {
            this.endpoints[0].removeClass(c);
            this.endpoints[1].removeClass(c);
            if (this.suspendedEndpoint) {
              this.suspendedEndpoint.removeClass(c);
            }
          }
          if (this.connector) {
            this.connector.removeClass(c);
          }
        },
        isVisible: function() {
          return this._jsPlumb.visible;
        },
        setVisible: function(v) {
          this._jsPlumb.visible = v;
          if (this.connector) {
            this.connector.setVisible(v);
          }
          this.repaint();
        },
        cleanup: function() {
          this.updateConnectedClass(true);
          this.endpoints = null;
          this.source = null;
          this.target = null;
          if (this.connector != null) {
            this.connector.cleanup(true);
            this.connector.destroy(true);
          }
          this.connector = null;
        },
        updateConnectedClass: function(remove) {
          if (this._jsPlumb) {
            _updateConnectedClass(this, this.source, this._jsPlumb.instance, remove);
            _updateConnectedClass(this, this.target, this._jsPlumb.instance, remove);
          }
        },
        setHover: function(state) {
          if (this.connector && this._jsPlumb && !this._jsPlumb.instance.isConnectionBeingDragged()) {
            this.connector.setHover(state);
            root.jsPlumb[state ? "addClass" : "removeClass"](this.source, this._jsPlumb.instance.hoverSourceClass);
            root.jsPlumb[state ? "addClass" : "removeClass"](this.target, this._jsPlumb.instance.hoverTargetClass);
          }
        },
        getUuids: function() {
          return [this.endpoints[0].getUuid(), this.endpoints[1].getUuid()];
        },
        getCost: function() {
          return this._jsPlumb ? this._jsPlumb.cost : -Infinity;
        },
        setCost: function(c) {
          this._jsPlumb.cost = c;
        },
        isDirected: function() {
          return this._jsPlumb.directed;
        },
        getConnector: function() {
          return this.connector;
        },
        prepareConnector: function(connectorSpec, typeId) {
          var connectorArgs = {
            _jsPlumb: this._jsPlumb.instance,
            cssClass: this._jsPlumb.params.cssClass,
            container: this._jsPlumb.params.container,
            "pointer-events": this._jsPlumb.params["pointer-events"]
          }, renderMode = this._jsPlumb.instance.getRenderMode(), connector;
          if (_ju.isString(connectorSpec)) {
            connector = makeConnector(this._jsPlumb.instance, renderMode, connectorSpec, connectorArgs, this);
          } else if (_ju.isArray(connectorSpec)) {
            if (connectorSpec.length === 1) {
              connector = makeConnector(this._jsPlumb.instance, renderMode, connectorSpec[0], connectorArgs, this);
            } else {
              connector = makeConnector(this._jsPlumb.instance, renderMode, connectorSpec[0], _ju.merge(connectorSpec[1], connectorArgs), this);
            }
          }
          if (typeId != null) {
            connector.typeId = typeId;
          }
          return connector;
        },
        setPreparedConnector: function(connector, doNotRepaint, doNotChangeListenerComponent, typeId) {
          if (this.connector !== connector) {
            var previous, previousClasses = "";
            if (this.connector != null) {
              previous = this.connector;
              previousClasses = previous.getClass();
              this.connector.cleanup();
              this.connector.destroy();
            }
            this.connector = connector;
            if (typeId) {
              this.cacheTypeItem("connector", connector, typeId);
            }
            this.canvas = this.connector.canvas;
            this.bgCanvas = this.connector.bgCanvas;
            this.connector.reattach(this._jsPlumb.instance);
            this.addClass(previousClasses);
            if (this.canvas) {
              this.canvas._jsPlumb = this;
            }
            if (this.bgCanvas) {
              this.bgCanvas._jsPlumb = this;
            }
            if (previous != null) {
              var o = this.getOverlays();
              for (var i = 0; i < o.length; i++) {
                if (o[i].transfer) {
                  o[i].transfer(this.connector);
                }
              }
            }
            if (!doNotChangeListenerComponent) {
              this.setListenerComponent(this.connector);
            }
            if (!doNotRepaint) {
              this.repaint();
            }
          }
        },
        setConnector: function(connectorSpec, doNotRepaint, doNotChangeListenerComponent, typeId) {
          var connector = this.prepareConnector(connectorSpec, typeId);
          this.setPreparedConnector(connector, doNotRepaint, doNotChangeListenerComponent, typeId);
        },
        paint: function(params) {
          if (!this._jsPlumb.instance.isSuspendDrawing() && this._jsPlumb.visible) {
            params = params || {};
            var timestamp = params.timestamp, swap = false, tId = swap ? this.sourceId : this.targetId, sId = swap ? this.targetId : this.sourceId, tIdx = swap ? 0 : 1, sIdx = swap ? 1 : 0;
            if (timestamp == null || timestamp !== this._jsPlumb.lastPaintedAt) {
              var sourceInfo = this._jsPlumb.instance.updateOffset({ elId: sId }).o, targetInfo = this._jsPlumb.instance.updateOffset({ elId: tId }).o, sE = this.endpoints[sIdx], tE = this.endpoints[tIdx];
              var sAnchorP = sE.anchor.getCurrentLocation(
                {
                  xy: [sourceInfo.left, sourceInfo.top],
                  wh: [sourceInfo.width, sourceInfo.height],
                  element: sE,
                  timestamp,
                  rotation: this._jsPlumb.instance.getRotation(this.sourceId)
                }
              ), tAnchorP = tE.anchor.getCurrentLocation({
                xy: [targetInfo.left, targetInfo.top],
                wh: [targetInfo.width, targetInfo.height],
                element: tE,
                timestamp,
                rotation: this._jsPlumb.instance.getRotation(this.targetId)
              });
              this.connector.resetBounds();
              this.connector.compute({
                sourcePos: sAnchorP,
                targetPos: tAnchorP,
                sourceOrientation: sE.anchor.getOrientation(sE),
                targetOrientation: tE.anchor.getOrientation(tE),
                sourceEndpoint: this.endpoints[sIdx],
                targetEndpoint: this.endpoints[tIdx],
                "stroke-width": this._jsPlumb.paintStyleInUse.strokeWidth,
                sourceInfo,
                targetInfo
              });
              var overlayExtents = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
              for (var i in this._jsPlumb.overlays) {
                if (this._jsPlumb.overlays.hasOwnProperty(i)) {
                  var o = this._jsPlumb.overlays[i];
                  if (o.isVisible()) {
                    this._jsPlumb.overlayPlacements[i] = o.draw(this.connector, this._jsPlumb.paintStyleInUse, this.getAbsoluteOverlayPosition(o));
                    overlayExtents.minX = Math.min(overlayExtents.minX, this._jsPlumb.overlayPlacements[i].minX);
                    overlayExtents.maxX = Math.max(overlayExtents.maxX, this._jsPlumb.overlayPlacements[i].maxX);
                    overlayExtents.minY = Math.min(overlayExtents.minY, this._jsPlumb.overlayPlacements[i].minY);
                    overlayExtents.maxY = Math.max(overlayExtents.maxY, this._jsPlumb.overlayPlacements[i].maxY);
                  }
                }
              }
              var lineWidth = parseFloat(this._jsPlumb.paintStyleInUse.strokeWidth || 1) / 2, outlineWidth = parseFloat(this._jsPlumb.paintStyleInUse.strokeWidth || 0), extents = {
                xmin: Math.min(this.connector.bounds.minX - (lineWidth + outlineWidth), overlayExtents.minX),
                ymin: Math.min(this.connector.bounds.minY - (lineWidth + outlineWidth), overlayExtents.minY),
                xmax: Math.max(this.connector.bounds.maxX + (lineWidth + outlineWidth), overlayExtents.maxX),
                ymax: Math.max(this.connector.bounds.maxY + (lineWidth + outlineWidth), overlayExtents.maxY)
              };
              this.connector.paintExtents = extents;
              this.connector.paint(this._jsPlumb.paintStyleInUse, null, extents);
              for (var j in this._jsPlumb.overlays) {
                if (this._jsPlumb.overlays.hasOwnProperty(j)) {
                  var p = this._jsPlumb.overlays[j];
                  if (p.isVisible()) {
                    p.paint(this._jsPlumb.overlayPlacements[j], extents);
                  }
                }
              }
            }
            this._jsPlumb.lastPaintedAt = timestamp;
          }
        },
        repaint: function(params) {
          var p = jsPlumb.extend(params || {}, {});
          p.elId = this.sourceId;
          this.paint(p);
        },
        prepareEndpoint: function(_jsPlumb, _newEndpoint, conn, existing, index, params, element, elementId, definition) {
          var e;
          if (existing) {
            conn.endpoints[index] = existing;
            existing.addConnection(conn);
          } else {
            if (!params.endpoints) {
              params.endpoints = [null, null];
            }
            var ep = definition || params.endpoints[index] || params.endpoint || _jsPlumb.Defaults.Endpoints[index] || _jp.Defaults.Endpoints[index] || _jsPlumb.Defaults.Endpoint || _jp.Defaults.Endpoint;
            if (!params.endpointStyles) {
              params.endpointStyles = [null, null];
            }
            if (!params.endpointHoverStyles) {
              params.endpointHoverStyles = [null, null];
            }
            var es = params.endpointStyles[index] || params.endpointStyle || _jsPlumb.Defaults.EndpointStyles[index] || _jp.Defaults.EndpointStyles[index] || _jsPlumb.Defaults.EndpointStyle || _jp.Defaults.EndpointStyle;
            if (es.fill == null && params.paintStyle != null) {
              es.fill = params.paintStyle.stroke;
            }
            if (es.outlineStroke == null && params.paintStyle != null) {
              es.outlineStroke = params.paintStyle.outlineStroke;
            }
            if (es.outlineWidth == null && params.paintStyle != null) {
              es.outlineWidth = params.paintStyle.outlineWidth;
            }
            var ehs = params.endpointHoverStyles[index] || params.endpointHoverStyle || _jsPlumb.Defaults.EndpointHoverStyles[index] || _jp.Defaults.EndpointHoverStyles[index] || _jsPlumb.Defaults.EndpointHoverStyle || _jp.Defaults.EndpointHoverStyle;
            if (params.hoverPaintStyle != null) {
              if (ehs == null) {
                ehs = {};
              }
              if (ehs.fill == null) {
                ehs.fill = params.hoverPaintStyle.stroke;
              }
            }
            var a = params.anchors ? params.anchors[index] : params.anchor ? params.anchor : _makeAnchor(_jsPlumb.Defaults.Anchors[index], elementId, _jsPlumb) || _makeAnchor(_jp.Defaults.Anchors[index], elementId, _jsPlumb) || _makeAnchor(_jsPlumb.Defaults.Anchor, elementId, _jsPlumb) || _makeAnchor(_jp.Defaults.Anchor, elementId, _jsPlumb), u = params.uuids ? params.uuids[index] : null;
            e = _newEndpoint({
              paintStyle: es,
              hoverPaintStyle: ehs,
              endpoint: ep,
              connections: [conn],
              uuid: u,
              anchor: a,
              source: element,
              scope: params.scope,
              reattach: params.reattach || _jsPlumb.Defaults.ReattachConnections,
              detachable: params.detachable || _jsPlumb.Defaults.ConnectionsDetachable
            });
            if (existing == null) {
              e.setDeleteOnEmpty(true);
            }
            conn.endpoints[index] = e;
            if (params.drawEndpoints === false) {
              e.setVisible(false, true, true);
            }
          }
          return e;
        },
        replaceEndpoint: function(idx, endpointDef) {
          var current = this.endpoints[idx], elId = current.elementId, ebe = this._jsPlumb.instance.getEndpoints(elId), _idx = ebe.indexOf(current), _new = this.makeEndpoint(idx === 0, current.element, elId, null, endpointDef);
          this.endpoints[idx] = _new;
          ebe.splice(_idx, 1, _new);
          this._jsPlumb.instance.deleteObject({ endpoint: current, deleteAttachedObjects: false });
          this._jsPlumb.instance.fire("endpointReplaced", { previous: current, current: _new });
          this._jsPlumb.instance.router.sourceOrTargetChanged(this.endpoints[1].elementId, this.endpoints[1].elementId, this, this.endpoints[1].element, 1);
        }
      });
    }).call(typeof window !== "undefined" ? window : jsplumb);
    (function() {
      var root = this, _ju = root.jsPlumbUtil, _jp = root.jsPlumb;
      _jp.AnchorManager = function(params) {
        var _amEndpoints = {}, continuousAnchorLocations = {}, continuousAnchorOrientations = {}, connectionsByElementId = {}, self = this, anchorLists = {}, jsPlumbInstance = params.jsPlumbInstance, floatingConnections = {}, placeAnchorsOnLine = function(desc, elementDimensions, elementPosition, connections, horizontal, otherMultiplier, reverse, rotation) {
          var a = [], step = elementDimensions[horizontal ? 0 : 1] / (connections.length + 1);
          for (var i = 0; i < connections.length; i++) {
            var val = (i + 1) * step, other = otherMultiplier * elementDimensions[horizontal ? 1 : 0];
            if (reverse) {
              val = elementDimensions[horizontal ? 0 : 1] - val;
            }
            var dx = horizontal ? val : other, x = elementPosition.left + dx, xp = dx / elementDimensions[0], dy = horizontal ? other : val, y = elementPosition.top + dy, yp = dy / elementDimensions[1];
            if (rotation !== 0) {
              var rotated = jsPlumbUtil.rotatePoint([x, y], [elementPosition.centerx, elementPosition.centery], rotation);
              x = rotated[0];
              y = rotated[1];
            }
            a.push([x, y, xp, yp, connections[i][1], connections[i][2]]);
          }
          return a;
        }, rightAndBottomSort = function(a, b) {
          return b[0][0] - a[0][0];
        }, leftAndTopSort = function(a, b) {
          var p1 = a[0][0] < 0 ? -Math.PI - a[0][0] : Math.PI - a[0][0], p2 = b[0][0] < 0 ? -Math.PI - b[0][0] : Math.PI - b[0][0];
          return p1 - p2;
        }, edgeSortFunctions = {
          "top": leftAndTopSort,
          "right": rightAndBottomSort,
          "bottom": rightAndBottomSort,
          "left": leftAndTopSort
        }, _sortHelper = function(_array, _fn) {
          return _array.sort(_fn);
        }, placeAnchors = function(elementId, _anchorLists) {
          var cd = jsPlumbInstance.getCachedData(elementId), sS = cd.s, sO = cd.o, placeSomeAnchors = function(desc, elementDimensions, elementPosition, unsortedConnections, isHorizontal, otherMultiplier, orientation) {
            if (unsortedConnections.length > 0) {
              var sc = _sortHelper(unsortedConnections, edgeSortFunctions[desc]), reverse = desc === "right" || desc === "top", rotation = jsPlumbInstance.getRotation(elementId), anchors = placeAnchorsOnLine(
                desc,
                elementDimensions,
                elementPosition,
                sc,
                isHorizontal,
                otherMultiplier,
                reverse,
                rotation
              );
              var _setAnchorLocation = function(endpoint, anchorPos) {
                continuousAnchorLocations[endpoint.id] = [anchorPos[0], anchorPos[1], anchorPos[2], anchorPos[3]];
                continuousAnchorOrientations[endpoint.id] = orientation;
              };
              for (var i = 0; i < anchors.length; i++) {
                var c = anchors[i][4], weAreSource = c.endpoints[0].elementId === elementId, weAreTarget = c.endpoints[1].elementId === elementId;
                if (weAreSource) {
                  _setAnchorLocation(c.endpoints[0], anchors[i]);
                }
                if (weAreTarget) {
                  _setAnchorLocation(c.endpoints[1], anchors[i]);
                }
              }
            }
          };
          placeSomeAnchors("bottom", sS, sO, _anchorLists.bottom, true, 1, [0, 1]);
          placeSomeAnchors("top", sS, sO, _anchorLists.top, true, 0, [0, -1]);
          placeSomeAnchors("left", sS, sO, _anchorLists.left, false, 0, [-1, 0]);
          placeSomeAnchors("right", sS, sO, _anchorLists.right, false, 1, [1, 0]);
        };
        this.reset = function() {
          _amEndpoints = {};
          connectionsByElementId = {};
          anchorLists = {};
        };
        this.addFloatingConnection = function(key, conn) {
          floatingConnections[key] = conn;
        };
        this.newConnection = function(conn) {
          var sourceId = conn.sourceId, targetId = conn.targetId, ep = conn.endpoints, doRegisterTarget = true, registerConnection = function(otherIndex, otherEndpoint, otherAnchor, elId, c) {
            if (sourceId === targetId && otherAnchor.isContinuous) {
              conn._jsPlumb.instance.removeElement(ep[1].canvas);
              doRegisterTarget = false;
            }
            _ju.addToList(connectionsByElementId, elId, [c, otherEndpoint, otherAnchor.constructor === _jp.DynamicAnchor]);
          };
          registerConnection(0, ep[0], ep[0].anchor, targetId, conn);
          if (doRegisterTarget) {
            registerConnection(1, ep[1], ep[1].anchor, sourceId, conn);
          }
        };
        var removeEndpointFromAnchorLists = function(endpoint) {
          (function(list, eId) {
            if (list) {
              var f = function(e) {
                return e[4] === eId;
              };
              _ju.removeWithFunction(list.top, f);
              _ju.removeWithFunction(list.left, f);
              _ju.removeWithFunction(list.bottom, f);
              _ju.removeWithFunction(list.right, f);
            }
          })(anchorLists[endpoint.elementId], endpoint.id);
        };
        this.connectionDetached = function(connInfo, doNotRedraw) {
          var connection = connInfo.connection || connInfo, sourceId = connInfo.sourceId, targetId = connInfo.targetId, ep = connection.endpoints, removeConnection = function(otherIndex, otherEndpoint, otherAnchor, elId, c) {
            _ju.removeWithFunction(connectionsByElementId[elId], function(_c) {
              return _c[0].id === c.id;
            });
          };
          removeConnection(1, ep[1], ep[1].anchor, sourceId, connection);
          removeConnection(0, ep[0], ep[0].anchor, targetId, connection);
          if (connection.floatingId) {
            removeConnection(connection.floatingIndex, connection.floatingEndpoint, connection.floatingEndpoint.anchor, connection.floatingId, connection);
            removeEndpointFromAnchorLists(connection.floatingEndpoint);
          }
          removeEndpointFromAnchorLists(connection.endpoints[0]);
          removeEndpointFromAnchorLists(connection.endpoints[1]);
          if (!doNotRedraw) {
            self.redraw(connection.sourceId);
            if (connection.targetId !== connection.sourceId) {
              self.redraw(connection.targetId);
            }
          }
        };
        this.addEndpoint = function(endpoint, elementId) {
          _ju.addToList(_amEndpoints, elementId, endpoint);
        };
        this.changeId = function(oldId, newId) {
          connectionsByElementId[newId] = connectionsByElementId[oldId];
          _amEndpoints[newId] = _amEndpoints[oldId];
          delete connectionsByElementId[oldId];
          delete _amEndpoints[oldId];
        };
        this.getConnectionsFor = function(elementId) {
          return connectionsByElementId[elementId] || [];
        };
        this.getEndpointsFor = function(elementId) {
          return _amEndpoints[elementId] || [];
        };
        this.deleteEndpoint = function(endpoint) {
          _ju.removeWithFunction(_amEndpoints[endpoint.elementId], function(e) {
            return e.id === endpoint.id;
          });
          removeEndpointFromAnchorLists(endpoint);
        };
        this.elementRemoved = function(elementId) {
          delete floatingConnections[elementId];
          delete _amEndpoints[elementId];
          _amEndpoints[elementId] = [];
        };
        var _updateAnchorList = function(lists, theta, order, conn, aBoolean, otherElId, idx, reverse, edgeId, elId, connsToPaint, endpointsToPaint) {
          var firstMatchingElIdx = -1, endpoint = conn.endpoints[idx], endpointId = endpoint.id, oIdx = [1, 0][idx], values = [
            [theta, order],
            conn,
            aBoolean,
            otherElId,
            endpointId
          ], listToAddTo = lists[edgeId], listToRemoveFrom = endpoint._continuousAnchorEdge ? lists[endpoint._continuousAnchorEdge] : null, i, candidate;
          if (listToRemoveFrom) {
            var rIdx = _ju.findWithFunction(listToRemoveFrom, function(e) {
              return e[4] === endpointId;
            });
            if (rIdx !== -1) {
              listToRemoveFrom.splice(rIdx, 1);
              for (i = 0; i < listToRemoveFrom.length; i++) {
                candidate = listToRemoveFrom[i][1];
                _ju.addWithFunction(connsToPaint, candidate, function(c) {
                  return c.id === candidate.id;
                });
                _ju.addWithFunction(endpointsToPaint, listToRemoveFrom[i][1].endpoints[idx], function(e) {
                  return e.id === candidate.endpoints[idx].id;
                });
                _ju.addWithFunction(endpointsToPaint, listToRemoveFrom[i][1].endpoints[oIdx], function(e) {
                  return e.id === candidate.endpoints[oIdx].id;
                });
              }
            }
          }
          for (i = 0; i < listToAddTo.length; i++) {
            candidate = listToAddTo[i][1];
            if (params.idx === 1 && listToAddTo[i][3] === otherElId && firstMatchingElIdx === -1) {
              firstMatchingElIdx = i;
            }
            _ju.addWithFunction(connsToPaint, candidate, function(c) {
              return c.id === candidate.id;
            });
            _ju.addWithFunction(endpointsToPaint, listToAddTo[i][1].endpoints[idx], function(e) {
              return e.id === candidate.endpoints[idx].id;
            });
            _ju.addWithFunction(endpointsToPaint, listToAddTo[i][1].endpoints[oIdx], function(e) {
              return e.id === candidate.endpoints[oIdx].id;
            });
          }
          {
            var insertIdx = reverse ? firstMatchingElIdx !== -1 ? firstMatchingElIdx : 0 : listToAddTo.length;
            listToAddTo.splice(insertIdx, 0, values);
          }
          endpoint._continuousAnchorEdge = edgeId;
        };
        this.sourceOrTargetChanged = function(originalId, newId, connection, newElement, anchorIndex) {
          if (anchorIndex === 0) {
            if (originalId !== newId) {
              connection.sourceId = newId;
              connection.source = newElement;
              _ju.removeWithFunction(connectionsByElementId[originalId], function(info) {
                return info[0].id === connection.id;
              });
              var tIdx = _ju.findWithFunction(connectionsByElementId[connection.targetId], function(i) {
                return i[0].id === connection.id;
              });
              if (tIdx > -1) {
                connectionsByElementId[connection.targetId][tIdx][0] = connection;
                connectionsByElementId[connection.targetId][tIdx][1] = connection.endpoints[0];
                connectionsByElementId[connection.targetId][tIdx][2] = connection.endpoints[0].anchor.constructor === _jp.DynamicAnchor;
              }
              _ju.addToList(connectionsByElementId, newId, [connection, connection.endpoints[1], connection.endpoints[1].anchor.constructor === _jp.DynamicAnchor]);
              if (connection.endpoints[1].anchor.isContinuous) {
                if (connection.source === connection.target) {
                  connection._jsPlumb.instance.removeElement(connection.endpoints[1].canvas);
                } else {
                  if (connection.endpoints[1].canvas.parentNode == null) {
                    connection._jsPlumb.instance.appendElement(connection.endpoints[1].canvas);
                  }
                }
              }
              connection.updateConnectedClass();
            }
          } else if (anchorIndex === 1) {
            var sourceElId = connection.endpoints[0].elementId;
            connection.target = newElement;
            connection.targetId = newId;
            var sIndex = _ju.findWithFunction(connectionsByElementId[sourceElId], function(i) {
              return i[0].id === connection.id;
            }), tIndex = _ju.findWithFunction(connectionsByElementId[originalId], function(i) {
              return i[0].id === connection.id;
            });
            if (sIndex !== -1) {
              connectionsByElementId[sourceElId][sIndex][0] = connection;
              connectionsByElementId[sourceElId][sIndex][1] = connection.endpoints[1];
              connectionsByElementId[sourceElId][sIndex][2] = connection.endpoints[1].anchor.constructor === _jp.DynamicAnchor;
            }
            if (tIndex > -1) {
              connectionsByElementId[originalId].splice(tIndex, 1);
              _ju.addToList(connectionsByElementId, newId, [connection, connection.endpoints[0], connection.endpoints[0].anchor.constructor === _jp.DynamicAnchor]);
            }
            connection.updateConnectedClass();
          }
        };
        this.rehomeEndpoint = function(ep, currentId, element) {
          var eps = _amEndpoints[currentId] || [], elementId = jsPlumbInstance.getId(element);
          if (elementId !== currentId) {
            var idx = eps.indexOf(ep);
            if (idx > -1) {
              var _ep = eps.splice(idx, 1)[0];
              self.add(_ep, elementId);
            }
          }
          for (var i = 0; i < ep.connections.length; i++) {
            if (ep.connections[i].sourceId === currentId) {
              self.sourceOrTargetChanged(currentId, ep.elementId, ep.connections[i], ep.element, 0);
            } else if (ep.connections[i].targetId === currentId) {
              self.sourceOrTargetChanged(currentId, ep.elementId, ep.connections[i], ep.element, 1);
            }
          }
        };
        this.redraw = function(elementId, ui, timestamp, offsetToUI, clearEdits, doNotRecalcEndpoint) {
          var connectionsToPaint = [], endpointsToPaint = [], anchorsToUpdate = [];
          if (!jsPlumbInstance.isSuspendDrawing()) {
            var ep = _amEndpoints[elementId] || [], endpointConnections = connectionsByElementId[elementId] || [];
            timestamp = timestamp || jsPlumbUtil.uuid();
            offsetToUI = offsetToUI || { left: 0, top: 0 };
            if (ui) {
              ui = {
                left: ui.left + offsetToUI.left,
                top: ui.top + offsetToUI.top
              };
            }
            var myOffset = jsPlumbInstance.updateOffset({ elId: elementId, offset: ui, recalc: false, timestamp }), orientationCache = {};
            for (var i = 0; i < endpointConnections.length; i++) {
              var conn = endpointConnections[i][0], sourceId = conn.sourceId, targetId = conn.targetId, sourceContinuous = conn.endpoints[0].anchor.isContinuous, targetContinuous = conn.endpoints[1].anchor.isContinuous;
              if (sourceContinuous || targetContinuous) {
                var oKey = sourceId + "_" + targetId, o = orientationCache[oKey], oIdx = conn.sourceId === elementId ? 1 : 0, targetRotation = jsPlumbInstance.getRotation(targetId), sourceRotation = jsPlumbInstance.getRotation(sourceId);
                if (sourceContinuous && !anchorLists[sourceId]) {
                  anchorLists[sourceId] = { top: [], right: [], bottom: [], left: [] };
                }
                if (targetContinuous && !anchorLists[targetId]) {
                  anchorLists[targetId] = { top: [], right: [], bottom: [], left: [] };
                }
                if (elementId !== targetId) {
                  jsPlumbInstance.updateOffset({ elId: targetId, timestamp });
                }
                if (elementId !== sourceId) {
                  jsPlumbInstance.updateOffset({ elId: sourceId, timestamp });
                }
                var td = jsPlumbInstance.getCachedData(targetId), sd = jsPlumbInstance.getCachedData(sourceId);
                if (targetId === sourceId && (sourceContinuous || targetContinuous)) {
                  _updateAnchorList(anchorLists[sourceId], -Math.PI / 2, 0, conn, false, targetId, 0, false, "top", sourceId, connectionsToPaint, endpointsToPaint);
                  _updateAnchorList(anchorLists[targetId], -Math.PI / 2, 0, conn, false, sourceId, 1, false, "top", targetId, connectionsToPaint, endpointsToPaint);
                } else {
                  if (!o) {
                    o = this.calculateOrientation(sourceId, targetId, sd.o, td.o, conn.endpoints[0].anchor, conn.endpoints[1].anchor, conn, sourceRotation, targetRotation);
                    orientationCache[oKey] = o;
                  }
                  if (sourceContinuous) {
                    _updateAnchorList(anchorLists[sourceId], o.theta, 0, conn, false, targetId, 0, false, o.a[0], sourceId, connectionsToPaint, endpointsToPaint);
                  }
                  if (targetContinuous) {
                    _updateAnchorList(anchorLists[targetId], o.theta2, -1, conn, true, sourceId, 1, true, o.a[1], targetId, connectionsToPaint, endpointsToPaint);
                  }
                }
                if (sourceContinuous) {
                  _ju.addWithFunction(anchorsToUpdate, sourceId, function(a) {
                    return a === sourceId;
                  });
                }
                if (targetContinuous) {
                  _ju.addWithFunction(anchorsToUpdate, targetId, function(a) {
                    return a === targetId;
                  });
                }
                _ju.addWithFunction(connectionsToPaint, conn, function(c) {
                  return c.id === conn.id;
                });
                if (sourceContinuous && oIdx === 0 || targetContinuous && oIdx === 1) {
                  _ju.addWithFunction(endpointsToPaint, conn.endpoints[oIdx], function(e) {
                    return e.id === conn.endpoints[oIdx].id;
                  });
                }
              }
            }
            for (i = 0; i < ep.length; i++) {
              if (ep[i].connections.length === 0 && ep[i].anchor.isContinuous) {
                if (!anchorLists[elementId]) {
                  anchorLists[elementId] = { top: [], right: [], bottom: [], left: [] };
                }
                _updateAnchorList(anchorLists[elementId], -Math.PI / 2, 0, { endpoints: [ep[i], ep[i]], paint: function() {
                } }, false, elementId, 0, false, ep[i].anchor.getDefaultFace(), elementId, connectionsToPaint, endpointsToPaint);
                _ju.addWithFunction(anchorsToUpdate, elementId, function(a) {
                  return a === elementId;
                });
              }
            }
            for (i = 0; i < anchorsToUpdate.length; i++) {
              placeAnchors(anchorsToUpdate[i], anchorLists[anchorsToUpdate[i]]);
            }
            for (i = 0; i < ep.length; i++) {
              ep[i].paint({ timestamp, offset: myOffset, dimensions: myOffset.s, recalc: doNotRecalcEndpoint !== true });
            }
            for (i = 0; i < endpointsToPaint.length; i++) {
              var cd = jsPlumbInstance.getCachedData(endpointsToPaint[i].elementId);
              endpointsToPaint[i].paint({ timestamp: null, offset: cd, dimensions: cd.s });
            }
            for (i = 0; i < endpointConnections.length; i++) {
              var otherEndpoint = endpointConnections[i][1];
              if (otherEndpoint.anchor.constructor === _jp.DynamicAnchor) {
                otherEndpoint.paint({ elementWithPrecedence: elementId, timestamp });
                _ju.addWithFunction(connectionsToPaint, endpointConnections[i][0], function(c) {
                  return c.id === endpointConnections[i][0].id;
                });
                for (var k = 0; k < otherEndpoint.connections.length; k++) {
                  if (otherEndpoint.connections[k] !== endpointConnections[i][0]) {
                    _ju.addWithFunction(connectionsToPaint, otherEndpoint.connections[k], function(c) {
                      return c.id === otherEndpoint.connections[k].id;
                    });
                  }
                }
              } else {
                _ju.addWithFunction(connectionsToPaint, endpointConnections[i][0], function(c) {
                  return c.id === endpointConnections[i][0].id;
                });
              }
            }
            var fc = floatingConnections[elementId];
            if (fc) {
              fc.paint({ timestamp, recalc: false, elId: elementId });
            }
            for (i = 0; i < connectionsToPaint.length; i++) {
              connectionsToPaint[i].paint({ elId: elementId, timestamp: null, recalc: false, clearEdits });
            }
          }
          return {
            c: connectionsToPaint,
            e: endpointsToPaint
          };
        };
        var ContinuousAnchor = function(anchorParams) {
          _ju.EventGenerator.apply(this);
          this.type = "Continuous";
          this.isDynamic = true;
          this.isContinuous = true;
          var faces = anchorParams.faces || ["top", "right", "bottom", "left"], clockwise = !(anchorParams.clockwise === false), availableFaces = {}, opposites = { "top": "bottom", "right": "left", "left": "right", "bottom": "top" }, clockwiseOptions = { "top": "right", "right": "bottom", "left": "top", "bottom": "left" }, antiClockwiseOptions = { "top": "left", "right": "top", "left": "bottom", "bottom": "right" }, secondBest = clockwise ? clockwiseOptions : antiClockwiseOptions, lastChoice = clockwise ? antiClockwiseOptions : clockwiseOptions, cssClass = anchorParams.cssClass || "", _currentFace = null, _lockedFace = null, X_AXIS_FACES = ["left", "right"], Y_AXIS_FACES = ["top", "bottom"], _lockedAxis = null;
          for (var i = 0; i < faces.length; i++) {
            availableFaces[faces[i]] = true;
          }
          this.getDefaultFace = function() {
            return faces.length === 0 ? "top" : faces[0];
          };
          this.isRelocatable = function() {
            return true;
          };
          this.isSnapOnRelocate = function() {
            return true;
          };
          this.verifyEdge = function(edge) {
            if (availableFaces[edge]) {
              return edge;
            } else if (availableFaces[opposites[edge]]) {
              return opposites[edge];
            } else if (availableFaces[secondBest[edge]]) {
              return secondBest[edge];
            } else if (availableFaces[lastChoice[edge]]) {
              return lastChoice[edge];
            }
            return edge;
          };
          this.isEdgeSupported = function(edge) {
            return _lockedAxis == null ? _lockedFace == null ? availableFaces[edge] === true : _lockedFace === edge : _lockedAxis.indexOf(edge) !== -1;
          };
          this.setCurrentFace = function(face, overrideLock) {
            _currentFace = face;
            if (overrideLock && _lockedFace != null) {
              _lockedFace = _currentFace;
            }
          };
          this.getCurrentFace = function() {
            return _currentFace;
          };
          this.getSupportedFaces = function() {
            var af = [];
            for (var k in availableFaces) {
              if (availableFaces[k]) {
                af.push(k);
              }
            }
            return af;
          };
          this.lock = function() {
            _lockedFace = _currentFace;
          };
          this.unlock = function() {
            _lockedFace = null;
          };
          this.isLocked = function() {
            return _lockedFace != null;
          };
          this.lockCurrentAxis = function() {
            if (_currentFace != null) {
              _lockedAxis = _currentFace === "left" || _currentFace === "right" ? X_AXIS_FACES : Y_AXIS_FACES;
            }
          };
          this.unlockCurrentAxis = function() {
            _lockedAxis = null;
          };
          this.compute = function(params2) {
            return continuousAnchorLocations[params2.element.id] || [0, 0];
          };
          this.getCurrentLocation = function(params2) {
            return continuousAnchorLocations[params2.element.id] || [0, 0];
          };
          this.getOrientation = function(endpoint) {
            return continuousAnchorOrientations[endpoint.id] || [0, 0];
          };
          this.getCssClass = function() {
            return cssClass;
          };
        };
        jsPlumbInstance.continuousAnchorFactory = {
          get: function(params2) {
            return new ContinuousAnchor(params2);
          },
          clear: function(elementId) {
            delete continuousAnchorLocations[elementId];
          }
        };
      };
      _jp.AnchorManager.prototype.calculateOrientation = function(sourceId, targetId, sd, td, sourceAnchor, targetAnchor, connection, sourceRotation, targetRotation) {
        var Orientation = { HORIZONTAL: "horizontal", VERTICAL: "vertical", DIAGONAL: "diagonal", IDENTITY: "identity" }, axes = ["left", "top", "right", "bottom"];
        if (sourceId === targetId) {
          return {
            orientation: Orientation.IDENTITY,
            a: ["top", "top"]
          };
        }
        var theta = Math.atan2(td.centery - sd.centery, td.centerx - sd.centerx), theta2 = Math.atan2(sd.centery - td.centery, sd.centerx - td.centerx);
        var candidates = [], midpoints = {};
        (function(types, dim) {
          for (var i2 = 0; i2 < types.length; i2++) {
            midpoints[types[i2]] = {
              "left": [dim[i2][0].left, dim[i2][0].centery],
              "right": [dim[i2][0].right, dim[i2][0].centery],
              "top": [dim[i2][0].centerx, dim[i2][0].top],
              "bottom": [dim[i2][0].centerx, dim[i2][0].bottom]
            };
            if (dim[i2][1] !== 0) {
              for (var axis in midpoints[types[i2]]) {
                midpoints[types[i2]][axis] = jsPlumbUtil.rotatePoint(midpoints[types[i2]][axis], [dim[i2][0].centerx, dim[i2][0].centery], dim[i2][1]);
              }
            }
          }
        })(["source", "target"], [[sd, sourceRotation], [td, targetRotation]]);
        for (var sf = 0; sf < axes.length; sf++) {
          for (var tf = 0; tf < axes.length; tf++) {
            candidates.push({
              source: axes[sf],
              target: axes[tf],
              dist: Biltong.lineLength(midpoints.source[axes[sf]], midpoints.target[axes[tf]])
            });
          }
        }
        candidates.sort(function(a, b) {
          return a.dist < b.dist ? -1 : a.dist > b.dist ? 1 : 0;
        });
        var sourceEdge = candidates[0].source, targetEdge = candidates[0].target;
        for (var i = 0; i < candidates.length; i++) {
          if (sourceAnchor.isContinuous && sourceAnchor.locked) {
            sourceEdge = sourceAnchor.getCurrentFace();
          } else if (!sourceAnchor.isContinuous || sourceAnchor.isEdgeSupported(candidates[i].source)) {
            sourceEdge = candidates[i].source;
          } else {
            sourceEdge = null;
          }
          if (targetAnchor.isContinuous && targetAnchor.locked) {
            targetEdge = targetAnchor.getCurrentFace();
          } else if (!targetAnchor.isContinuous || targetAnchor.isEdgeSupported(candidates[i].target)) {
            targetEdge = candidates[i].target;
          } else {
            targetEdge = null;
          }
          if (sourceEdge != null && targetEdge != null) {
            break;
          }
        }
        if (sourceAnchor.isContinuous) {
          sourceAnchor.setCurrentFace(sourceEdge);
        }
        if (targetAnchor.isContinuous) {
          targetAnchor.setCurrentFace(targetEdge);
        }
        return {
          a: [sourceEdge, targetEdge],
          theta,
          theta2
        };
      };
      _jp.Anchor = function(params) {
        this.x = params.x || 0;
        this.y = params.y || 0;
        this.elementId = params.elementId;
        this.cssClass = params.cssClass || "";
        this.orientation = params.orientation || [0, 0];
        this.lastReturnValue = null;
        this.offsets = params.offsets || [0, 0];
        this.timestamp = null;
        this._unrotatedOrientation = [
          this.orientation[0],
          this.orientation[1]
        ];
        this.relocatable = params.relocatable !== false;
        this.snapOnRelocate = params.snapOnRelocate !== false;
        this.locked = false;
        _ju.EventGenerator.apply(this);
        this.compute = function(params2) {
          var xy = params2.xy, wh = params2.wh, timestamp = params2.timestamp;
          if (timestamp && timestamp === this.timestamp) {
            return this.lastReturnValue;
          }
          var candidate = [xy[0] + this.x * wh[0] + this.offsets[0], xy[1] + this.y * wh[1] + this.offsets[1], this.x, this.y];
          var rotation = params2.rotation;
          if (rotation != null && rotation !== 0) {
            var c2 = jsPlumbUtil.rotatePoint(candidate, [xy[0] + wh[0] / 2, xy[1] + wh[1] / 2], rotation);
            this.orientation[0] = Math.round(this._unrotatedOrientation[0] * c2[2] - this._unrotatedOrientation[1] * c2[3]);
            this.orientation[1] = Math.round(this._unrotatedOrientation[1] * c2[2] + this._unrotatedOrientation[0] * c2[3]);
            this.lastReturnValue = [c2[0], c2[1], this.x, this.y];
          } else {
            this.orientation[0] = this._unrotatedOrientation[0];
            this.orientation[1] = this._unrotatedOrientation[1];
            this.lastReturnValue = candidate;
          }
          this.timestamp = timestamp;
          return this.lastReturnValue;
        };
        this.getCurrentLocation = function(params2) {
          params2 = params2 || {};
          return this.lastReturnValue == null || params2.timestamp != null && this.timestamp !== params2.timestamp ? this.compute(params2) : this.lastReturnValue;
        };
        this.setPosition = function(x, y, ox, oy, overrideLock) {
          if (!this.locked || overrideLock) {
            this.x = x;
            this.y = y;
            this.orientation = [ox, oy];
            this.lastReturnValue = null;
          }
        };
      };
      _ju.extend(_jp.Anchor, _ju.EventGenerator, {
        equals: function(anchor) {
          if (!anchor) {
            return false;
          }
          var ao = anchor.getOrientation(), o = this.getOrientation();
          return this.x === anchor.x && this.y === anchor.y && this.offsets[0] === anchor.offsets[0] && this.offsets[1] === anchor.offsets[1] && o[0] === ao[0] && o[1] === ao[1];
        },
        getOrientation: function() {
          return this.orientation;
        },
        getCssClass: function() {
          return this.cssClass;
        }
      });
      _jp.FloatingAnchor = function(params) {
        _jp.Anchor.apply(this, arguments);
        var ref = params.reference, refCanvas = params.referenceCanvas, size = _jp.getSize(refCanvas), xDir = 0, yDir = 0, orientation = null, _lastResult = null;
        this.orientation = null;
        this.x = 0;
        this.y = 0;
        this.isFloating = true;
        this.compute = function(params2) {
          var xy = params2.xy, result = [xy[0] + size[0] / 2, xy[1] + size[1] / 2];
          _lastResult = result;
          return result;
        };
        this.getOrientation = function(_endpoint) {
          if (orientation) {
            return orientation;
          } else {
            var o = ref.getOrientation(_endpoint);
            return [
              Math.abs(o[0]) * xDir * -1,
              Math.abs(o[1]) * yDir * -1
            ];
          }
        };
        this.over = function(anchor, endpoint) {
          orientation = anchor.getOrientation(endpoint);
        };
        this.out = function() {
          orientation = null;
        };
        this.getCurrentLocation = function(params2) {
          return _lastResult == null ? this.compute(params2) : _lastResult;
        };
      };
      _ju.extend(_jp.FloatingAnchor, _jp.Anchor);
      var _convertAnchor = function(anchor, jsPlumbInstance, elementId) {
        return anchor.constructor === _jp.Anchor ? anchor : jsPlumbInstance.makeAnchor(anchor, elementId, jsPlumbInstance);
      };
      _jp.DynamicAnchor = function(params) {
        _jp.Anchor.apply(this, arguments);
        this.isDynamic = true;
        this.anchors = [];
        this.elementId = params.elementId;
        this.jsPlumbInstance = params.jsPlumbInstance;
        for (var i = 0; i < params.anchors.length; i++) {
          this.anchors[i] = _convertAnchor(params.anchors[i], this.jsPlumbInstance, this.elementId);
        }
        this.getAnchors = function() {
          return this.anchors;
        };
        var _curAnchor = this.anchors.length > 0 ? this.anchors[0] : null, _lastAnchor = _curAnchor, _distance = function(anchor, cx, cy, xy, wh, r, tr) {
          var ax = xy[0] + anchor.x * wh[0], ay = xy[1] + anchor.y * wh[1], acx = xy[0] + wh[0] / 2, acy = xy[1] + wh[1] / 2;
          if (r != null && r !== 0) {
            var rotated = jsPlumbUtil.rotatePoint([ax, ay], [acx, acy], r);
            ax = rotated[0];
            ay = rotated[1];
          }
          return Math.sqrt(Math.pow(cx - ax, 2) + Math.pow(cy - ay, 2)) + Math.sqrt(Math.pow(acx - ax, 2) + Math.pow(acy - ay, 2));
        }, _anchorSelector = params.selector || function(xy, wh, txy, twh, r, tr, anchors) {
          var cx = txy[0] + twh[0] / 2, cy = txy[1] + twh[1] / 2;
          var minIdx = -1, minDist = Infinity;
          for (var i2 = 0; i2 < anchors.length; i2++) {
            var d = _distance(anchors[i2], cx, cy, xy, wh, r);
            if (d < minDist) {
              minIdx = i2 + 0;
              minDist = d;
            }
          }
          return anchors[minIdx];
        };
        this.compute = function(params2) {
          var xy = params2.xy, wh = params2.wh, txy = params2.txy, twh = params2.twh, r = params2.rotation, tr = params2.tRotation;
          this.timestamp = params2.timestamp;
          if (this.locked || txy == null || twh == null) {
            this.lastReturnValue = _curAnchor.compute(params2);
            return this.lastReturnValue;
          } else {
            params2.timestamp = null;
          }
          _curAnchor = _anchorSelector(xy, wh, txy, twh, r, tr, this.anchors);
          this.x = _curAnchor.x;
          this.y = _curAnchor.y;
          if (_curAnchor !== _lastAnchor) {
            this.fire("anchorChanged", _curAnchor);
          }
          _lastAnchor = _curAnchor;
          this.lastReturnValue = _curAnchor.compute(params2);
          return this.lastReturnValue;
        };
        this.getCurrentLocation = function(params2) {
          return _curAnchor != null ? _curAnchor.getCurrentLocation(params2) : null;
        };
        this.getOrientation = function(_endpoint) {
          return _curAnchor != null ? _curAnchor.getOrientation(_endpoint) : [0, 0];
        };
        this.over = function(anchor, endpoint) {
          if (_curAnchor != null) {
            _curAnchor.over(anchor, endpoint);
          }
        };
        this.out = function() {
          if (_curAnchor != null) {
            _curAnchor.out();
          }
        };
        this.setAnchor = function(a) {
          _curAnchor = a;
        };
        this.getCssClass = function() {
          return _curAnchor && _curAnchor.getCssClass() || "";
        };
        this.setAnchorCoordinates = function(coords) {
          var idx = jsPlumbUtil.findWithFunction(this.anchors, function(a) {
            return a.x === coords[0] && a.y === coords[1];
          });
          if (idx !== -1) {
            this.setAnchor(this.anchors[idx]);
            return true;
          } else {
            return false;
          }
        };
      };
      _ju.extend(_jp.DynamicAnchor, _jp.Anchor);
      var _curryAnchor = function(x, y, ox, oy, type, fnInit) {
        _jp.Anchors[type] = function(params) {
          var a = params.jsPlumbInstance.makeAnchor([x, y, ox, oy, 0, 0], params.elementId, params.jsPlumbInstance);
          a.type = type;
          if (fnInit) {
            fnInit(a, params);
          }
          return a;
        };
      };
      _curryAnchor(0.5, 0, 0, -1, "TopCenter");
      _curryAnchor(0.5, 1, 0, 1, "BottomCenter");
      _curryAnchor(0, 0.5, -1, 0, "LeftMiddle");
      _curryAnchor(1, 0.5, 1, 0, "RightMiddle");
      _curryAnchor(0.5, 0, 0, -1, "Top");
      _curryAnchor(0.5, 1, 0, 1, "Bottom");
      _curryAnchor(0, 0.5, -1, 0, "Left");
      _curryAnchor(1, 0.5, 1, 0, "Right");
      _curryAnchor(0.5, 0.5, 0, 0, "Center");
      _curryAnchor(1, 0, 0, -1, "TopRight");
      _curryAnchor(1, 1, 0, 1, "BottomRight");
      _curryAnchor(0, 0, 0, -1, "TopLeft");
      _curryAnchor(0, 1, 0, 1, "BottomLeft");
      _jp.Defaults.DynamicAnchors = function(params) {
        return params.jsPlumbInstance.makeAnchors(["TopCenter", "RightMiddle", "BottomCenter", "LeftMiddle"], params.elementId, params.jsPlumbInstance);
      };
      _jp.Anchors.AutoDefault = function(params) {
        var a = params.jsPlumbInstance.makeDynamicAnchor(_jp.Defaults.DynamicAnchors(params));
        a.type = "AutoDefault";
        return a;
      };
      var _curryContinuousAnchor = function(type, faces) {
        _jp.Anchors[type] = function(params) {
          var a = params.jsPlumbInstance.makeAnchor(["Continuous", { faces }], params.elementId, params.jsPlumbInstance);
          a.type = type;
          return a;
        };
      };
      _jp.Anchors.Continuous = function(params) {
        return params.jsPlumbInstance.continuousAnchorFactory.get(params);
      };
      _curryContinuousAnchor("ContinuousLeft", ["left"]);
      _curryContinuousAnchor("ContinuousTop", ["top"]);
      _curryContinuousAnchor("ContinuousBottom", ["bottom"]);
      _curryContinuousAnchor("ContinuousRight", ["right"]);
      _curryAnchor(0, 0, 0, 0, "Assign", function(anchor, params) {
        var pf = params.position || "Fixed";
        anchor.positionFinder = pf.constructor === String ? params.jsPlumbInstance.AnchorPositionFinders[pf] : pf;
        anchor.constructorParams = params;
      });
      root.jsPlumbInstance.prototype.AnchorPositionFinders = {
        "Fixed": function(dp, ep, es) {
          return [(dp.left - ep.left) / es[0], (dp.top - ep.top) / es[1]];
        },
        "Grid": function(dp, ep, es, params) {
          var dx = dp.left - ep.left, dy = dp.top - ep.top, gx = es[0] / params.grid[0], gy = es[1] / params.grid[1], mx = Math.floor(dx / gx), my = Math.floor(dy / gy);
          return [(mx * gx + gx / 2) / es[0], (my * gy + gy / 2) / es[1]];
        }
      };
      _jp.Anchors.Perimeter = function(params) {
        params = params || {};
        var anchorCount = params.anchorCount || 60, shape = params.shape;
        if (!shape) {
          throw new Error("no shape supplied to Perimeter Anchor type");
        }
        var _circle = function() {
          var r = 0.5, step = Math.PI * 2 / anchorCount, current = 0, a2 = [];
          for (var i = 0; i < anchorCount; i++) {
            var x = r + r * Math.sin(current), y = r + r * Math.cos(current);
            a2.push([x, y, 0, 0]);
            current += step;
          }
          return a2;
        }, _path = function(segments) {
          var anchorsPerFace = anchorCount / segments.length, a2 = [], _computeFace = function(x1, y1, x2, y2, fractionalLength, ox, oy) {
            anchorsPerFace = anchorCount * fractionalLength;
            var dx = (x2 - x1) / anchorsPerFace, dy = (y2 - y1) / anchorsPerFace;
            for (var i2 = 0; i2 < anchorsPerFace; i2++) {
              a2.push([
                x1 + dx * i2,
                y1 + dy * i2,
                ox == null ? 0 : ox,
                oy == null ? 0 : oy
              ]);
            }
          };
          for (var i = 0; i < segments.length; i++) {
            _computeFace.apply(null, segments[i]);
          }
          return a2;
        }, _shape = function(faces) {
          var s = [];
          for (var i = 0; i < faces.length; i++) {
            s.push([faces[i][0], faces[i][1], faces[i][2], faces[i][3], 1 / faces.length, faces[i][4], faces[i][5]]);
          }
          return _path(s);
        }, _rectangle = function() {
          return _shape([
            [0, 0, 1, 0, 0, -1],
            [1, 0, 1, 1, 1, 0],
            [1, 1, 0, 1, 0, 1],
            [0, 1, 0, 0, -1, 0]
          ]);
        };
        var _shapes = {
          "Circle": _circle,
          "Ellipse": _circle,
          "Diamond": function() {
            return _shape([
              [0.5, 0, 1, 0.5],
              [1, 0.5, 0.5, 1],
              [0.5, 1, 0, 0.5],
              [0, 0.5, 0.5, 0]
            ]);
          },
          "Rectangle": _rectangle,
          "Square": _rectangle,
          "Triangle": function() {
            return _shape([
              [0.5, 0, 1, 1],
              [1, 1, 0, 1],
              [0, 1, 0.5, 0]
            ]);
          },
          "Path": function(params2) {
            var points = params2.points, p = [], tl = 0;
            for (var i = 0; i < points.length - 1; i++) {
              var l = Math.sqrt(Math.pow(points[i][2] - points[i][0]) + Math.pow(points[i][3] - points[i][1]));
              tl += l;
              p.push([points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], l]);
            }
            for (var j = 0; j < p.length; j++) {
              p[j][4] = p[j][4] / tl;
            }
            return _path(p);
          }
        }, _rotate = function(points, amountInDegrees) {
          var o = [], theta = amountInDegrees / 180 * Math.PI;
          for (var i = 0; i < points.length; i++) {
            var _x = points[i][0] - 0.5, _y = points[i][1] - 0.5;
            o.push([
              0.5 + (_x * Math.cos(theta) - _y * Math.sin(theta)),
              0.5 + (_x * Math.sin(theta) + _y * Math.cos(theta)),
              points[i][2],
              points[i][3]
            ]);
          }
          return o;
        };
        if (!_shapes[shape]) {
          throw new Error("Shape [" + shape + "] is unknown by Perimeter Anchor type");
        }
        var da = _shapes[shape](params);
        if (params.rotation) {
          da = _rotate(da, params.rotation);
        }
        var a = params.jsPlumbInstance.makeDynamicAnchor(da);
        a.type = "Perimeter";
        return a;
      };
    }).call(typeof window !== "undefined" ? window : jsplumb);
    (function() {
      var root = this;
      root.jsPlumbUtil;
      var _jp = root.jsPlumb;
      _jp.DefaultRouter = function(jsPlumbInstance) {
        this.jsPlumbInstance = jsPlumbInstance;
        this.anchorManager = new _jp.AnchorManager({ jsPlumbInstance });
        this.sourceOrTargetChanged = function(originalId, newId, connection, newElement, anchorIndex) {
          this.anchorManager.sourceOrTargetChanged(originalId, newId, connection, newElement, anchorIndex);
        };
        this.reset = function() {
          this.anchorManager.reset();
        };
        this.changeId = function(oldId, newId) {
          this.anchorManager.changeId(oldId, newId);
        };
        this.elementRemoved = function(elementId) {
          this.anchorManager.elementRemoved(elementId);
        };
        this.newConnection = function(conn) {
          this.anchorManager.newConnection(conn);
        };
        this.connectionDetached = function(connInfo, doNotRedraw) {
          this.anchorManager.connectionDetached(connInfo, doNotRedraw);
        };
        this.redraw = function(elementId, ui, timestamp, offsetToUI, clearEdits, doNotRecalcEndpoint) {
          return this.anchorManager.redraw(elementId, ui, timestamp, offsetToUI, clearEdits, doNotRecalcEndpoint);
        };
        this.deleteEndpoint = function(endpoint) {
          this.anchorManager.deleteEndpoint(endpoint);
        };
        this.rehomeEndpoint = function(ep, currentId, element) {
          this.anchorManager.rehomeEndpoint(ep, currentId, element);
        };
        this.addEndpoint = function(endpoint, elementId) {
          this.anchorManager.addEndpoint(endpoint, elementId);
        };
      };
    }).call(typeof window !== "undefined" ? window : jsplumb);
    (function() {
      var root = this, _jp = root.jsPlumb, _ju = root.jsPlumbUtil, _jg = root.Biltong;
      _jp.Segments = {
        /*
         * Class: AbstractSegment
         * A Connector is made up of 1..N Segments, each of which has a Type, such as 'Straight', 'Arc',
         * 'Bezier'. This is new from 1.4.2, and gives us a lot more flexibility when drawing connections: things such
         * as rounded corners for flowchart connectors, for example, or a straight line stub for Bezier connections, are
         * much easier to do now.
         *
         * A Segment is responsible for providing coordinates for painting it, and also must be able to report its length.
         * 
         */
        AbstractSegment: function(params) {
          this.params = params;
          this.findClosestPointOnPath = function(x, y) {
            return {
              d: Infinity,
              x: null,
              y: null,
              l: null
            };
          };
          this.getBounds = function() {
            return {
              minX: Math.min(params.x1, params.x2),
              minY: Math.min(params.y1, params.y2),
              maxX: Math.max(params.x1, params.x2),
              maxY: Math.max(params.y1, params.y2)
            };
          };
          this.lineIntersection = function(x1, y1, x2, y2) {
            return [];
          };
          this.boxIntersection = function(x, y, w, h) {
            var a = [];
            a.push.apply(a, this.lineIntersection(x, y, x + w, y));
            a.push.apply(a, this.lineIntersection(x + w, y, x + w, y + h));
            a.push.apply(a, this.lineIntersection(x + w, y + h, x, y + h));
            a.push.apply(a, this.lineIntersection(x, y + h, x, y));
            return a;
          };
          this.boundingBoxIntersection = function(box) {
            return this.boxIntersection(box.x, box.y, box.w, box.y);
          };
        },
        Straight: function(params) {
          _jp.Segments.AbstractSegment.apply(this, arguments);
          var length, m, m2, x1, x2, y1, y2, _recalc = function() {
            length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            m = _jg.gradient({ x: x1, y: y1 }, { x: x2, y: y2 });
            m2 = -1 / m;
          };
          this.type = "Straight";
          this.getLength = function() {
            return length;
          };
          this.getGradient = function() {
            return m;
          };
          this.getCoordinates = function() {
            return { x1, y1, x2, y2 };
          };
          this.setCoordinates = function(coords) {
            x1 = coords.x1;
            y1 = coords.y1;
            x2 = coords.x2;
            y2 = coords.y2;
            _recalc();
          };
          this.setCoordinates({ x1: params.x1, y1: params.y1, x2: params.x2, y2: params.y2 });
          this.getBounds = function() {
            return {
              minX: Math.min(x1, x2),
              minY: Math.min(y1, y2),
              maxX: Math.max(x1, x2),
              maxY: Math.max(y1, y2)
            };
          };
          this.pointOnPath = function(location, absolute) {
            if (location === 0 && !absolute) {
              return { x: x1, y: y1 };
            } else if (location === 1 && !absolute) {
              return { x: x2, y: y2 };
            } else {
              var l = absolute ? location > 0 ? location : length + location : location * length;
              return _jg.pointOnLine({ x: x1, y: y1 }, { x: x2, y: y2 }, l);
            }
          };
          this.gradientAtPoint = function(_) {
            return m;
          };
          this.pointAlongPathFrom = function(location, distance, absolute) {
            var p = this.pointOnPath(location, absolute), farAwayPoint = distance <= 0 ? { x: x1, y: y1 } : { x: x2, y: y2 };
            if (distance <= 0 && Math.abs(distance) > 1) {
              distance *= -1;
            }
            return _jg.pointOnLine(p, farAwayPoint, distance);
          };
          var within = function(a, b, c) {
            return c >= Math.min(a, b) && c <= Math.max(a, b);
          };
          var closest = function(a, b, c) {
            return Math.abs(c - a) < Math.abs(c - b) ? a : b;
          };
          this.findClosestPointOnPath = function(x, y) {
            var out = {
              d: Infinity,
              x: null,
              y: null,
              l: null,
              x1,
              x2,
              y1,
              y2
            };
            if (m === 0) {
              out.y = y1;
              out.x = within(x1, x2, x) ? x : closest(x1, x2, x);
            } else if (m === Infinity || m === -Infinity) {
              out.x = x1;
              out.y = within(y1, y2, y) ? y : closest(y1, y2, y);
            } else {
              var b = y1 - m * x1, b2 = y - m2 * x, _x1 = (b2 - b) / (m - m2), _y1 = m * _x1 + b;
              out.x = within(x1, x2, _x1) ? _x1 : closest(x1, x2, _x1);
              out.y = within(y1, y2, _y1) ? _y1 : closest(y1, y2, _y1);
            }
            var fractionInSegment = _jg.lineLength([out.x, out.y], [x1, y1]);
            out.d = _jg.lineLength([x, y], [out.x, out.y]);
            out.l = fractionInSegment / length;
            return out;
          };
          var _pointLiesBetween = function(q, p1, p2) {
            return p2 > p1 ? p1 <= q && q <= p2 : p1 >= q && q >= p2;
          }, _plb = _pointLiesBetween;
          this.lineIntersection = function(_x1, _y1, _x2, _y2) {
            var m22 = Math.abs(_jg.gradient({ x: _x1, y: _y1 }, { x: _x2, y: _y2 })), m1 = Math.abs(m), b = m1 === Infinity ? x1 : y1 - m1 * x1, out = [], b2 = m22 === Infinity ? _x1 : _y1 - m22 * _x1;
            if (m22 !== m1) {
              if (m22 === Infinity && m1 === 0) {
                if (_plb(_x1, x1, x2) && _plb(y1, _y1, _y2)) {
                  out = [_x1, y1];
                }
              } else if (m22 === 0 && m1 === Infinity) {
                if (_plb(_y1, y1, y2) && _plb(x1, _x1, _x2)) {
                  out = [x1, _y1];
                }
              } else {
                var X, Y;
                if (m22 === Infinity) {
                  X = _x1;
                  if (_plb(X, x1, x2)) {
                    Y = m1 * _x1 + b;
                    if (_plb(Y, _y1, _y2)) {
                      out = [X, Y];
                    }
                  }
                } else if (m22 === 0) {
                  Y = _y1;
                  if (_plb(Y, y1, y2)) {
                    X = (_y1 - b) / m1;
                    if (_plb(X, _x1, _x2)) {
                      out = [X, Y];
                    }
                  }
                } else {
                  X = (b2 - b) / (m1 - m22);
                  Y = m1 * X + b;
                  if (_plb(X, x1, x2) && _plb(Y, y1, y2)) {
                    out = [X, Y];
                  }
                }
              }
            }
            return out;
          };
          this.boxIntersection = function(x, y, w, h) {
            var a = [];
            a.push.apply(a, this.lineIntersection(x, y, x + w, y));
            a.push.apply(a, this.lineIntersection(x + w, y, x + w, y + h));
            a.push.apply(a, this.lineIntersection(x + w, y + h, x, y + h));
            a.push.apply(a, this.lineIntersection(x, y + h, x, y));
            return a;
          };
          this.boundingBoxIntersection = function(box) {
            return this.boxIntersection(box.x, box.y, box.w, box.h);
          };
        },
        /*
        		         Arc Segment. You need to supply:
        
        		         r   -   radius
        		         cx  -   center x for the arc
        		         cy  -   center y for the arc
        		         ac  -   whether the arc is anticlockwise or not. default is clockwise.
        
        		         and then either:
        
        		         startAngle  -   startAngle for the arc.
        		         endAngle    -   endAngle for the arc.
        
        		         or:
        
        		         x1          -   x for start point
        		         y1          -   y for start point
        		         x2          -   x for end point
        		         y2          -   y for end point
        
        		         */
        Arc: function(params) {
          _jp.Segments.AbstractSegment.apply(this, arguments);
          var _calcAngle = function(_x, _y) {
            return _jg.theta([params.cx, params.cy], [_x, _y]);
          }, _calcAngleForLocation = function(segment, location) {
            if (segment.anticlockwise) {
              var sa = segment.startAngle < segment.endAngle ? segment.startAngle + TWO_PI : segment.startAngle, s = Math.abs(sa - segment.endAngle);
              return sa - s * location;
            } else {
              var ea2 = segment.endAngle < segment.startAngle ? segment.endAngle + TWO_PI : segment.endAngle, ss = Math.abs(ea2 - segment.startAngle);
              return segment.startAngle + ss * location;
            }
          }, TWO_PI = 2 * Math.PI;
          this.radius = params.r;
          this.anticlockwise = params.ac;
          this.type = "Arc";
          if (params.startAngle && params.endAngle) {
            this.startAngle = params.startAngle;
            this.endAngle = params.endAngle;
            this.x1 = params.cx + this.radius * Math.cos(params.startAngle);
            this.y1 = params.cy + this.radius * Math.sin(params.startAngle);
            this.x2 = params.cx + this.radius * Math.cos(params.endAngle);
            this.y2 = params.cy + this.radius * Math.sin(params.endAngle);
          } else {
            this.startAngle = _calcAngle(params.x1, params.y1);
            this.endAngle = _calcAngle(params.x2, params.y2);
            this.x1 = params.x1;
            this.y1 = params.y1;
            this.x2 = params.x2;
            this.y2 = params.y2;
          }
          if (this.endAngle < 0) {
            this.endAngle += TWO_PI;
          }
          if (this.startAngle < 0) {
            this.startAngle += TWO_PI;
          }
          var ea = this.endAngle < this.startAngle ? this.endAngle + TWO_PI : this.endAngle;
          this.sweep = Math.abs(ea - this.startAngle);
          if (this.anticlockwise) {
            this.sweep = TWO_PI - this.sweep;
          }
          var circumference = 2 * Math.PI * this.radius, frac = this.sweep / TWO_PI, length = circumference * frac;
          this.getLength = function() {
            return length;
          };
          this.getBounds = function() {
            return {
              minX: params.cx - params.r,
              maxX: params.cx + params.r,
              minY: params.cy - params.r,
              maxY: params.cy + params.r
            };
          };
          var VERY_SMALL_VALUE = 1e-10, gentleRound = function(n) {
            var f = Math.floor(n), r = Math.ceil(n);
            if (n - f < VERY_SMALL_VALUE) {
              return f;
            } else if (r - n < VERY_SMALL_VALUE) {
              return r;
            }
            return n;
          };
          this.pointOnPath = function(location, absolute) {
            if (location === 0) {
              return { x: this.x1, y: this.y1, theta: this.startAngle };
            } else if (location === 1) {
              return { x: this.x2, y: this.y2, theta: this.endAngle };
            }
            if (absolute) {
              location = location / length;
            }
            var angle = _calcAngleForLocation(this, location), _x = params.cx + params.r * Math.cos(angle), _y = params.cy + params.r * Math.sin(angle);
            return { x: gentleRound(_x), y: gentleRound(_y), theta: angle };
          };
          this.gradientAtPoint = function(location, absolute) {
            var p = this.pointOnPath(location, absolute);
            var m = _jg.normal([params.cx, params.cy], [p.x, p.y]);
            if (!this.anticlockwise && (m === Infinity || m === -Infinity)) {
              m *= -1;
            }
            return m;
          };
          this.pointAlongPathFrom = function(location, distance, absolute) {
            var p = this.pointOnPath(location, absolute), arcSpan = distance / circumference * 2 * Math.PI, dir = this.anticlockwise ? -1 : 1, startAngle = p.theta + dir * arcSpan, startX = params.cx + this.radius * Math.cos(startAngle), startY = params.cy + this.radius * Math.sin(startAngle);
            return { x: startX, y: startY };
          };
        },
        Bezier: function(params) {
          this.curve = [
            { x: params.x1, y: params.y1 },
            { x: params.cp1x, y: params.cp1y },
            { x: params.cp2x, y: params.cp2y },
            { x: params.x2, y: params.y2 }
          ];
          var _isPoint = function(c) {
            return c[0].x === c[1].x && c[0].y === c[1].y;
          };
          var _dist = function(p1, p2) {
            return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
          };
          var _compute = (function(loc) {
            var EMPTY_POINT = { x: 0, y: 0 };
            if (loc === 0) {
              return this.curve[0];
            }
            var degree = this.curve.length - 1;
            if (loc === 1) {
              return this.curve[degree];
            }
            var o = this.curve;
            var s = 1 - loc;
            if (degree === 0) {
              return this.curve[0];
            }
            if (degree === 1) {
              return {
                x: s * o[0].x + loc * o[1].x,
                y: s * o[0].y + loc * o[1].y
              };
            }
            if (degree < 4) {
              var l = s * s, h = loc * loc, u = 0, m, g, f;
              if (degree === 2) {
                o = [o[0], o[1], o[2], EMPTY_POINT];
                m = l;
                g = 2 * (s * loc);
                f = h;
              } else if (degree === 3) {
                m = l * s;
                g = 3 * (l * loc);
                f = 3 * (s * h);
                u = loc * h;
              }
              return {
                x: m * o[0].x + g * o[1].x + f * o[2].x + u * o[3].x,
                y: m * o[0].y + g * o[1].y + f * o[2].y + u * o[3].y
              };
            } else {
              return EMPTY_POINT;
            }
          }).bind(this);
          var _getLUT = function(steps) {
            var out = [];
            steps--;
            for (var n = 0; n <= steps; n++) {
              out.push(_compute(n / steps));
            }
            return out;
          };
          var _computeLength = (function() {
            if (_isPoint(this.curve)) {
              this.length = 0;
            }
            var steps = 16;
            var lut = _getLUT(steps);
            this.length = 0;
            for (var i = 0; i < steps - 1; i++) {
              var a = lut[i], b = lut[i + 1];
              this.length += _dist(a, b);
            }
          }).bind(this);
          _jp.Segments.AbstractSegment.apply(this, arguments);
          this.bounds = {
            minX: Math.min(params.x1, params.x2, params.cp1x, params.cp2x),
            minY: Math.min(params.y1, params.y2, params.cp1y, params.cp2y),
            maxX: Math.max(params.x1, params.x2, params.cp1x, params.cp2x),
            maxY: Math.max(params.y1, params.y2, params.cp1y, params.cp2y)
          };
          this.type = "Bezier";
          _computeLength();
          var _translateLocation = function(_curve, location, absolute) {
            if (absolute) {
              location = root.jsBezier.locationAlongCurveFrom(_curve, location > 0 ? 0 : 1, location);
            }
            return location;
          };
          this.pointOnPath = function(location, absolute) {
            location = _translateLocation(this.curve, location, absolute);
            return root.jsBezier.pointOnCurve(this.curve, location);
          };
          this.gradientAtPoint = function(location, absolute) {
            location = _translateLocation(this.curve, location, absolute);
            return root.jsBezier.gradientAtPoint(this.curve, location);
          };
          this.pointAlongPathFrom = function(location, distance, absolute) {
            location = _translateLocation(this.curve, location, absolute);
            return root.jsBezier.pointAlongCurveFrom(this.curve, location, distance);
          };
          this.getLength = function() {
            return this.length;
          };
          this.getBounds = function() {
            return this.bounds;
          };
          this.findClosestPointOnPath = function(x, y) {
            var p = root.jsBezier.nearestPointOnCurve({ x, y }, this.curve);
            return {
              d: Math.sqrt(Math.pow(p.point.x - x, 2) + Math.pow(p.point.y - y, 2)),
              x: p.point.x,
              y: p.point.y,
              l: 1 - p.location,
              s: this
            };
          };
          this.lineIntersection = function(x1, y1, x2, y2) {
            return root.jsBezier.lineIntersection(x1, y1, x2, y2, this.curve);
          };
        }
      };
      _jp.SegmentRenderer = {
        getPath: function(segment, isFirstSegment) {
          return {
            "Straight": function(isFirstSegment2) {
              var d = segment.getCoordinates();
              return (isFirstSegment2 ? "M " + d.x1 + " " + d.y1 + " " : "") + "L " + d.x2 + " " + d.y2;
            },
            "Bezier": function(isFirstSegment2) {
              var d = segment.params;
              return (isFirstSegment2 ? "M " + d.x2 + " " + d.y2 + " " : "") + "C " + d.cp2x + " " + d.cp2y + " " + d.cp1x + " " + d.cp1y + " " + d.x1 + " " + d.y1;
            },
            "Arc": function(isFirstSegment2) {
              var d = segment.params, laf = segment.sweep > Math.PI ? 1 : 0, sf = segment.anticlockwise ? 0 : 1;
              return (isFirstSegment2 ? "M" + segment.x1 + " " + segment.y1 + " " : "") + "A " + segment.radius + " " + d.r + " 0 " + laf + "," + sf + " " + segment.x2 + " " + segment.y2;
            }
          }[segment.type](isFirstSegment);
        }
      };
      var AbstractComponent = function() {
        this.resetBounds = function() {
          this.bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
        };
        this.resetBounds();
      };
      _jp.Connectors.AbstractConnector = function(params) {
        AbstractComponent.apply(this, arguments);
        var segments = [], totalLength = 0, segmentProportions = [], segmentProportionalLengths = [], stub = params.stub || 0, sourceStub = _ju.isArray(stub) ? stub[0] : stub, targetStub = _ju.isArray(stub) ? stub[1] : stub, gap = params.gap || 0, sourceGap = _ju.isArray(gap) ? gap[0] : gap, targetGap = _ju.isArray(gap) ? gap[1] : gap, userProvidedSegments = null, paintInfo = null;
        this.getPathData = function() {
          var p = "";
          for (var i = 0; i < segments.length; i++) {
            p += _jp.SegmentRenderer.getPath(segments[i], i === 0);
            p += " ";
          }
          return p;
        };
        this.findSegmentForPoint = function(x, y) {
          var out = { d: Infinity, s: null, x: null, y: null, l: null };
          for (var i = 0; i < segments.length; i++) {
            var _s = segments[i].findClosestPointOnPath(x, y);
            if (_s.d < out.d) {
              out.d = _s.d;
              out.l = _s.l;
              out.x = _s.x;
              out.y = _s.y;
              out.s = segments[i];
              out.x1 = _s.x1;
              out.x2 = _s.x2;
              out.y1 = _s.y1;
              out.y2 = _s.y2;
              out.index = i;
              out.connectorLocation = segmentProportions[i][0] + _s.l * (segmentProportions[i][1] - segmentProportions[i][0]);
            }
          }
          return out;
        };
        this.lineIntersection = function(x1, y1, x2, y2) {
          var out = [];
          for (var i = 0; i < segments.length; i++) {
            out.push.apply(out, segments[i].lineIntersection(x1, y1, x2, y2));
          }
          return out;
        };
        this.boxIntersection = function(x, y, w, h) {
          var out = [];
          for (var i = 0; i < segments.length; i++) {
            out.push.apply(out, segments[i].boxIntersection(x, y, w, h));
          }
          return out;
        };
        this.boundingBoxIntersection = function(box) {
          var out = [];
          for (var i = 0; i < segments.length; i++) {
            out.push.apply(out, segments[i].boundingBoxIntersection(box));
          }
          return out;
        };
        var _updateSegmentProportions = function() {
          var curLoc = 0;
          for (var i = 0; i < segments.length; i++) {
            var sl = segments[i].getLength();
            segmentProportionalLengths[i] = sl / totalLength;
            segmentProportions[i] = [curLoc, curLoc += sl / totalLength];
          }
        }, _findSegmentForLocation = function(location, absolute) {
          var idx, i, inSegmentProportion;
          if (absolute) {
            location = location > 0 ? location / totalLength : (totalLength + location) / totalLength;
          }
          if (location === 1) {
            idx = segments.length - 1;
            inSegmentProportion = 1;
          } else if (location === 0) {
            inSegmentProportion = 0;
            idx = 0;
          } else {
            if (location >= 0.5) {
              idx = 0;
              inSegmentProportion = 0;
              for (i = segmentProportions.length - 1; i > -1; i--) {
                if (segmentProportions[i][1] >= location && segmentProportions[i][0] <= location) {
                  idx = i;
                  inSegmentProportion = (location - segmentProportions[i][0]) / segmentProportionalLengths[i];
                  break;
                }
              }
            } else {
              idx = segmentProportions.length - 1;
              inSegmentProportion = 1;
              for (i = 0; i < segmentProportions.length; i++) {
                if (segmentProportions[i][1] >= location) {
                  idx = i;
                  inSegmentProportion = (location - segmentProportions[i][0]) / segmentProportionalLengths[i];
                  break;
                }
              }
            }
          }
          return { segment: segments[idx], proportion: inSegmentProportion, index: idx };
        }, _addSegment = function(conn, type, params2) {
          if (params2.x1 === params2.x2 && params2.y1 === params2.y2) {
            return;
          }
          var s = new _jp.Segments[type](params2);
          segments.push(s);
          totalLength += s.getLength();
          conn.updateBounds(s);
        }, _clearSegments = function() {
          totalLength = segments.length = segmentProportions.length = segmentProportionalLengths.length = 0;
        };
        this.setSegments = function(_segs) {
          userProvidedSegments = [];
          totalLength = 0;
          for (var i = 0; i < _segs.length; i++) {
            userProvidedSegments.push(_segs[i]);
            totalLength += _segs[i].getLength();
          }
        };
        this.getLength = function() {
          return totalLength;
        };
        var _prepareCompute = function(params2) {
          this.strokeWidth = params2.strokeWidth;
          var segment = _jg.quadrant(params2.sourcePos, params2.targetPos), swapX = params2.targetPos[0] < params2.sourcePos[0], swapY = params2.targetPos[1] < params2.sourcePos[1], lw = params2.strokeWidth || 1, so = params2.sourceEndpoint.anchor.getOrientation(params2.sourceEndpoint), to = params2.targetEndpoint.anchor.getOrientation(params2.targetEndpoint), x = swapX ? params2.targetPos[0] : params2.sourcePos[0], y = swapY ? params2.targetPos[1] : params2.sourcePos[1], w = Math.abs(params2.targetPos[0] - params2.sourcePos[0]), h = Math.abs(params2.targetPos[1] - params2.sourcePos[1]);
          if (so[0] === 0 && so[1] === 0 || to[0] === 0 && to[1] === 0) {
            var index = w > h ? 0 : 1, oIndex = [1, 0][index];
            so = [];
            to = [];
            so[index] = params2.sourcePos[index] > params2.targetPos[index] ? -1 : 1;
            to[index] = params2.sourcePos[index] > params2.targetPos[index] ? 1 : -1;
            so[oIndex] = 0;
            to[oIndex] = 0;
          }
          var sx = swapX ? w + sourceGap * so[0] : sourceGap * so[0], sy = swapY ? h + sourceGap * so[1] : sourceGap * so[1], tx = swapX ? targetGap * to[0] : w + targetGap * to[0], ty = swapY ? targetGap * to[1] : h + targetGap * to[1], oProduct = so[0] * to[0] + so[1] * to[1];
          var result = {
            sx,
            sy,
            tx,
            ty,
            lw,
            xSpan: Math.abs(tx - sx),
            ySpan: Math.abs(ty - sy),
            mx: (sx + tx) / 2,
            my: (sy + ty) / 2,
            so,
            to,
            x,
            y,
            w,
            h,
            segment,
            startStubX: sx + so[0] * sourceStub,
            startStubY: sy + so[1] * sourceStub,
            endStubX: tx + to[0] * targetStub,
            endStubY: ty + to[1] * targetStub,
            isXGreaterThanStubTimes2: Math.abs(sx - tx) > sourceStub + targetStub,
            isYGreaterThanStubTimes2: Math.abs(sy - ty) > sourceStub + targetStub,
            opposite: oProduct === -1,
            perpendicular: oProduct === 0,
            orthogonal: oProduct === 1,
            sourceAxis: so[0] === 0 ? "y" : "x",
            points: [x, y, w, h, sx, sy, tx, ty],
            stubs: [sourceStub, targetStub]
          };
          result.anchorOrientation = result.opposite ? "opposite" : result.orthogonal ? "orthogonal" : "perpendicular";
          return result;
        };
        this.getSegments = function() {
          return segments;
        };
        this.updateBounds = function(segment) {
          var segBounds = segment.getBounds();
          this.bounds.minX = Math.min(this.bounds.minX, segBounds.minX);
          this.bounds.maxX = Math.max(this.bounds.maxX, segBounds.maxX);
          this.bounds.minY = Math.min(this.bounds.minY, segBounds.minY);
          this.bounds.maxY = Math.max(this.bounds.maxY, segBounds.maxY);
        };
        this.pointOnPath = function(location, absolute) {
          var seg = _findSegmentForLocation(location, absolute);
          return seg.segment && seg.segment.pointOnPath(seg.proportion, false) || [0, 0];
        };
        this.gradientAtPoint = function(location, absolute) {
          var seg = _findSegmentForLocation(location, absolute);
          return seg.segment && seg.segment.gradientAtPoint(seg.proportion, false) || 0;
        };
        this.pointAlongPathFrom = function(location, distance, absolute) {
          var seg = _findSegmentForLocation(location, absolute);
          return seg.segment && seg.segment.pointAlongPathFrom(seg.proportion, distance, false) || [0, 0];
        };
        this.compute = function(params2) {
          paintInfo = _prepareCompute.call(this, params2);
          _clearSegments();
          this._compute(paintInfo, params2);
          this.x = paintInfo.points[0];
          this.y = paintInfo.points[1];
          this.w = paintInfo.points[2];
          this.h = paintInfo.points[3];
          this.segment = paintInfo.segment;
          _updateSegmentProportions();
        };
        return {
          addSegment: _addSegment,
          prepareCompute: _prepareCompute,
          sourceStub,
          targetStub,
          maxStub: Math.max(sourceStub, targetStub),
          sourceGap,
          targetGap,
          maxGap: Math.max(sourceGap, targetGap)
        };
      };
      _ju.extend(_jp.Connectors.AbstractConnector, AbstractComponent);
      _jp.Endpoints.AbstractEndpoint = function(params) {
        AbstractComponent.apply(this, arguments);
        var compute = this.compute = function(anchorPoint, orientation, endpointStyle, connectorPaintStyle) {
          var out = this._compute.apply(this, arguments);
          this.x = out[0];
          this.y = out[1];
          this.w = out[2];
          this.h = out[3];
          this.bounds.minX = this.x;
          this.bounds.minY = this.y;
          this.bounds.maxX = this.x + this.w;
          this.bounds.maxY = this.y + this.h;
          return out;
        };
        return {
          compute,
          cssClass: params.cssClass
        };
      };
      _ju.extend(_jp.Endpoints.AbstractEndpoint, AbstractComponent);
      _jp.Endpoints.Dot = function(params) {
        this.type = "Dot";
        _jp.Endpoints.AbstractEndpoint.apply(this, arguments);
        params = params || {};
        this.radius = params.radius || 10;
        this.defaultOffset = 0.5 * this.radius;
        this.defaultInnerRadius = this.radius / 3;
        this._compute = function(anchorPoint, orientation, endpointStyle, connectorPaintStyle) {
          this.radius = endpointStyle.radius || this.radius;
          var x = anchorPoint[0] - this.radius, y = anchorPoint[1] - this.radius, w = this.radius * 2, h = this.radius * 2;
          if (endpointStyle.stroke) {
            var lw = endpointStyle.strokeWidth || 1;
            x -= lw;
            y -= lw;
            w += lw * 2;
            h += lw * 2;
          }
          return [x, y, w, h, this.radius];
        };
      };
      _ju.extend(_jp.Endpoints.Dot, _jp.Endpoints.AbstractEndpoint);
      _jp.Endpoints.Rectangle = function(params) {
        this.type = "Rectangle";
        _jp.Endpoints.AbstractEndpoint.apply(this, arguments);
        params = params || {};
        this.width = params.width || 20;
        this.height = params.height || 20;
        this._compute = function(anchorPoint, orientation, endpointStyle, connectorPaintStyle) {
          var width = endpointStyle.width || this.width, height = endpointStyle.height || this.height, x = anchorPoint[0] - width / 2, y = anchorPoint[1] - height / 2;
          return [x, y, width, height];
        };
      };
      _ju.extend(_jp.Endpoints.Rectangle, _jp.Endpoints.AbstractEndpoint);
      var DOMElementEndpoint = function(params) {
        _jp.jsPlumbUIComponent.apply(this, arguments);
        this._jsPlumb.displayElements = [];
      };
      _ju.extend(DOMElementEndpoint, _jp.jsPlumbUIComponent, {
        getDisplayElements: function() {
          return this._jsPlumb.displayElements;
        },
        appendDisplayElement: function(el) {
          this._jsPlumb.displayElements.push(el);
        }
      });
      _jp.Endpoints.Image = function(params) {
        this.type = "Image";
        DOMElementEndpoint.apply(this, arguments);
        _jp.Endpoints.AbstractEndpoint.apply(this, arguments);
        var _onload = params.onload, src = params.src || params.url, clazz = params.cssClass ? " " + params.cssClass : "";
        this._jsPlumb.img = new Image();
        this._jsPlumb.ready = false;
        this._jsPlumb.initialized = false;
        this._jsPlumb.deleted = false;
        this._jsPlumb.widthToUse = params.width;
        this._jsPlumb.heightToUse = params.height;
        this._jsPlumb.endpoint = params.endpoint;
        this._jsPlumb.img.onload = (function() {
          if (this._jsPlumb != null) {
            this._jsPlumb.ready = true;
            this._jsPlumb.widthToUse = this._jsPlumb.widthToUse || this._jsPlumb.img.width;
            this._jsPlumb.heightToUse = this._jsPlumb.heightToUse || this._jsPlumb.img.height;
            if (_onload) {
              _onload(this);
            }
          }
        }).bind(this);
        this._jsPlumb.endpoint.setImage = (function(_img, onload) {
          var s = _img.constructor === String ? _img : _img.src;
          _onload = onload;
          this._jsPlumb.img.src = s;
          if (this.canvas != null) {
            this.canvas.setAttribute("src", this._jsPlumb.img.src);
          }
        }).bind(this);
        this._jsPlumb.endpoint.setImage(src, _onload);
        this._compute = function(anchorPoint, orientation, endpointStyle, connectorPaintStyle) {
          this.anchorPoint = anchorPoint;
          if (this._jsPlumb.ready) {
            return [
              anchorPoint[0] - this._jsPlumb.widthToUse / 2,
              anchorPoint[1] - this._jsPlumb.heightToUse / 2,
              this._jsPlumb.widthToUse,
              this._jsPlumb.heightToUse
            ];
          } else {
            return [0, 0, 0, 0];
          }
        };
        this.canvas = _jp.createElement("img", {
          position: "absolute",
          margin: 0,
          padding: 0,
          outline: 0
        }, this._jsPlumb.instance.endpointClass + clazz);
        if (this._jsPlumb.widthToUse) {
          this.canvas.setAttribute("width", this._jsPlumb.widthToUse);
        }
        if (this._jsPlumb.heightToUse) {
          this.canvas.setAttribute("height", this._jsPlumb.heightToUse);
        }
        this._jsPlumb.instance.appendElement(this.canvas);
        this.actuallyPaint = function(d, style, anchor) {
          if (!this._jsPlumb.deleted) {
            if (!this._jsPlumb.initialized) {
              this.canvas.setAttribute("src", this._jsPlumb.img.src);
              this.appendDisplayElement(this.canvas);
              this._jsPlumb.initialized = true;
            }
            var x = this.anchorPoint[0] - this._jsPlumb.widthToUse / 2, y = this.anchorPoint[1] - this._jsPlumb.heightToUse / 2;
            _ju.sizeElement(this.canvas, x, y, this._jsPlumb.widthToUse, this._jsPlumb.heightToUse);
          }
        };
        this.paint = function(style, anchor) {
          if (this._jsPlumb != null) {
            if (this._jsPlumb.ready) {
              this.actuallyPaint(style, anchor);
            } else {
              root.setTimeout((function() {
                this.paint(style, anchor);
              }).bind(this), 200);
            }
          }
        };
      };
      _ju.extend(_jp.Endpoints.Image, [DOMElementEndpoint, _jp.Endpoints.AbstractEndpoint], {
        cleanup: function(force) {
          if (force) {
            this._jsPlumb.deleted = true;
            if (this.canvas) {
              this.canvas.parentNode.removeChild(this.canvas);
            }
            this.canvas = null;
          }
        }
      });
      _jp.Endpoints.Blank = function(params) {
        _jp.Endpoints.AbstractEndpoint.apply(this, arguments);
        this.type = "Blank";
        DOMElementEndpoint.apply(this, arguments);
        this._compute = function(anchorPoint, orientation, endpointStyle, connectorPaintStyle) {
          return [anchorPoint[0], anchorPoint[1], 10, 0];
        };
        var clazz = params.cssClass ? " " + params.cssClass : "";
        this.canvas = _jp.createElement("div", {
          display: "block",
          width: "1px",
          height: "1px",
          background: "transparent",
          position: "absolute"
        }, this._jsPlumb.instance.endpointClass + clazz);
        this._jsPlumb.instance.appendElement(this.canvas);
        this.paint = function(style, anchor) {
          _ju.sizeElement(this.canvas, this.x, this.y, this.w, this.h);
        };
      };
      _ju.extend(_jp.Endpoints.Blank, [_jp.Endpoints.AbstractEndpoint, DOMElementEndpoint], {
        cleanup: function() {
          if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
          }
        }
      });
      _jp.Endpoints.Triangle = function(params) {
        this.type = "Triangle";
        _jp.Endpoints.AbstractEndpoint.apply(this, arguments);
        var self = this;
        params = params || {};
        params.width = params.width || 55;
        params.height = params.height || 55;
        this.width = params.width;
        this.height = params.height;
        this._compute = function(anchorPoint, orientation, endpointStyle, connectorPaintStyle) {
          var width = endpointStyle.width || self.width, height = endpointStyle.height || self.height, x = anchorPoint[0] - width / 2, y = anchorPoint[1] - height / 2;
          return [x, y, width, height];
        };
      };
      var AbstractOverlay = _jp.Overlays.AbstractOverlay = function(params) {
        this.visible = true;
        this.isAppendedAtTopLevel = true;
        this.component = params.component;
        this.loc = params.location == null ? 0.5 : params.location;
        this.endpointLoc = params.endpointLocation == null ? [0.5, 0.5] : params.endpointLocation;
        this.visible = params.visible !== false;
      };
      AbstractOverlay.prototype = {
        cleanup: function(force) {
          if (force) {
            this.component = null;
            this.canvas = null;
            this.endpointLoc = null;
          }
        },
        reattach: function(instance, component) {
        },
        setVisible: function(val) {
          this.visible = val;
          this.component.repaint();
        },
        isVisible: function() {
          return this.visible;
        },
        hide: function() {
          this.setVisible(false);
        },
        show: function() {
          this.setVisible(true);
        },
        incrementLocation: function(amount) {
          this.loc += amount;
          this.component.repaint();
        },
        setLocation: function(l) {
          this.loc = l;
          this.component.repaint();
        },
        getLocation: function() {
          return this.loc;
        },
        updateFrom: function() {
        }
      };
      _jp.Overlays.Arrow = function(params) {
        this.type = "Arrow";
        AbstractOverlay.apply(this, arguments);
        this.isAppendedAtTopLevel = false;
        params = params || {};
        var self = this;
        this.length = params.length || 20;
        this.width = params.width || 20;
        this.id = params.id;
        this.direction = (params.direction || 1) < 0 ? -1 : 1;
        var paintStyle = params.paintStyle || { "stroke-width": 1 }, foldback = params.foldback || 0.623;
        this.computeMaxSize = function() {
          return self.width * 1.5;
        };
        this.elementCreated = function(p, component) {
          this.path = p;
          if (params.events) {
            for (var i in params.events) {
              _jp.on(p, i, params.events[i]);
            }
          }
        };
        this.draw = function(component, currentConnectionPaintStyle) {
          var hxy, mid, txy, tail, cxy;
          if (component.pointAlongPathFrom) {
            if (_ju.isString(this.loc) || this.loc > 1 || this.loc < 0) {
              var l = parseInt(this.loc, 10), fromLoc = this.loc < 0 ? 1 : 0;
              hxy = component.pointAlongPathFrom(fromLoc, l, false);
              mid = component.pointAlongPathFrom(fromLoc, l - this.direction * this.length / 2, false);
              txy = _jg.pointOnLine(hxy, mid, this.length);
            } else if (this.loc === 1) {
              hxy = component.pointOnPath(this.loc);
              mid = component.pointAlongPathFrom(this.loc, -this.length);
              txy = _jg.pointOnLine(hxy, mid, this.length);
              if (this.direction === -1) {
                var _ = txy;
                txy = hxy;
                hxy = _;
              }
            } else if (this.loc === 0) {
              txy = component.pointOnPath(this.loc);
              mid = component.pointAlongPathFrom(this.loc, this.length);
              hxy = _jg.pointOnLine(txy, mid, this.length);
              if (this.direction === -1) {
                var __ = txy;
                txy = hxy;
                hxy = __;
              }
            } else {
              hxy = component.pointAlongPathFrom(this.loc, this.direction * this.length / 2);
              mid = component.pointOnPath(this.loc);
              txy = _jg.pointOnLine(hxy, mid, this.length);
            }
            tail = _jg.perpendicularLineTo(hxy, txy, this.width);
            cxy = _jg.pointOnLine(hxy, txy, foldback * this.length);
            var d = { hxy, tail, cxy }, stroke = paintStyle.stroke || currentConnectionPaintStyle.stroke, fill = paintStyle.fill || currentConnectionPaintStyle.stroke, lineWidth = paintStyle.strokeWidth || currentConnectionPaintStyle.strokeWidth;
            return {
              component,
              d,
              "stroke-width": lineWidth,
              stroke,
              fill,
              minX: Math.min(hxy.x, tail[0].x, tail[1].x),
              maxX: Math.max(hxy.x, tail[0].x, tail[1].x),
              minY: Math.min(hxy.y, tail[0].y, tail[1].y),
              maxY: Math.max(hxy.y, tail[0].y, tail[1].y)
            };
          } else {
            return { component, minX: 0, maxX: 0, minY: 0, maxY: 0 };
          }
        };
      };
      _ju.extend(_jp.Overlays.Arrow, AbstractOverlay, {
        updateFrom: function(d) {
          this.length = d.length || this.length;
          this.width = d.width || this.width;
          this.direction = d.direction != null ? d.direction : this.direction;
          this.foldback = d.foldback || this.foldback;
        },
        cleanup: function() {
          if (this.path && this.path.parentNode) {
            this.path.parentNode.removeChild(this.path);
          }
        }
      });
      _jp.Overlays.PlainArrow = function(params) {
        params = params || {};
        var p = _jp.extend(params, { foldback: 1 });
        _jp.Overlays.Arrow.call(this, p);
        this.type = "PlainArrow";
      };
      _ju.extend(_jp.Overlays.PlainArrow, _jp.Overlays.Arrow);
      _jp.Overlays.Diamond = function(params) {
        params = params || {};
        var l = params.length || 40, p = _jp.extend(params, { length: l / 2, foldback: 2 });
        _jp.Overlays.Arrow.call(this, p);
        this.type = "Diamond";
      };
      _ju.extend(_jp.Overlays.Diamond, _jp.Overlays.Arrow);
      var _getDimensions = function(component, forceRefresh) {
        if (component._jsPlumb.cachedDimensions == null || forceRefresh) {
          component._jsPlumb.cachedDimensions = component.getDimensions();
        }
        return component._jsPlumb.cachedDimensions;
      };
      var AbstractDOMOverlay = function(params) {
        _jp.jsPlumbUIComponent.apply(this, arguments);
        AbstractOverlay.apply(this, arguments);
        var _f = this.fire;
        this.fire = function() {
          _f.apply(this, arguments);
          if (this.component) {
            this.component.fire.apply(this.component, arguments);
          }
        };
        this.detached = false;
        this.id = params.id;
        this._jsPlumb.div = null;
        this._jsPlumb.initialised = false;
        this._jsPlumb.component = params.component;
        this._jsPlumb.cachedDimensions = null;
        this._jsPlumb.create = params.create;
        this._jsPlumb.initiallyInvisible = params.visible === false;
        this.getElement = function() {
          if (this._jsPlumb.div == null) {
            var div = this._jsPlumb.div = _jp.getElement(this._jsPlumb.create(this._jsPlumb.component));
            div.style.position = "absolute";
            jsPlumb.addClass(div, this._jsPlumb.instance.overlayClass + " " + (this.cssClass ? this.cssClass : params.cssClass ? params.cssClass : ""));
            this._jsPlumb.instance.appendElement(div);
            this._jsPlumb.instance.getId(div);
            this.canvas = div;
            var ts = "translate(-50%, -50%)";
            div.style.webkitTransform = ts;
            div.style.mozTransform = ts;
            div.style.msTransform = ts;
            div.style.oTransform = ts;
            div.style.transform = ts;
            div._jsPlumb = this;
            if (params.visible === false) {
              div.style.display = "none";
            }
          }
          return this._jsPlumb.div;
        };
        this.draw = function(component, currentConnectionPaintStyle, absolutePosition) {
          var td = _getDimensions(this);
          if (td != null && td.length === 2) {
            var cxy = { x: 0, y: 0 };
            if (absolutePosition) {
              cxy = { x: absolutePosition[0], y: absolutePosition[1] };
            } else if (component.pointOnPath) {
              var loc = this.loc, absolute = false;
              if (_ju.isString(this.loc) || this.loc < 0 || this.loc > 1) {
                loc = parseInt(this.loc, 10);
                absolute = true;
              }
              cxy = component.pointOnPath(loc, absolute);
            } else {
              var locToUse = this.loc.constructor === Array ? this.loc : this.endpointLoc;
              cxy = {
                x: locToUse[0] * component.w,
                y: locToUse[1] * component.h
              };
            }
            var minx = cxy.x - td[0] / 2, miny = cxy.y - td[1] / 2;
            return {
              component,
              d: { minx, miny, td, cxy },
              minX: minx,
              maxX: minx + td[0],
              minY: miny,
              maxY: miny + td[1]
            };
          } else {
            return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
          }
        };
      };
      _ju.extend(AbstractDOMOverlay, [_jp.jsPlumbUIComponent, AbstractOverlay], {
        getDimensions: function() {
          return [1, 1];
        },
        setVisible: function(state) {
          if (this._jsPlumb.div) {
            this._jsPlumb.div.style.display = state ? "block" : "none";
            if (state && this._jsPlumb.initiallyInvisible) {
              _getDimensions(this, true);
              this.component.repaint();
              this._jsPlumb.initiallyInvisible = false;
            }
          }
        },
        /*
         * Function: clearCachedDimensions
         * Clears the cached dimensions for the label. As a performance enhancement, label dimensions are
         * cached from 1.3.12 onwards. The cache is cleared when you change the label text, of course, but
         * there are other reasons why the text dimensions might change - if you make a change through CSS, for
         * example, you might change the font size.  in that case you should explicitly call this method.
         */
        clearCachedDimensions: function() {
          this._jsPlumb.cachedDimensions = null;
        },
        cleanup: function(force) {
          if (force) {
            if (this._jsPlumb.div != null) {
              this._jsPlumb.div._jsPlumb = null;
              this._jsPlumb.instance.removeElement(this._jsPlumb.div);
            }
          } else {
            if (this._jsPlumb && this._jsPlumb.div && this._jsPlumb.div.parentNode) {
              this._jsPlumb.div.parentNode.removeChild(this._jsPlumb.div);
            }
            this.detached = true;
          }
        },
        reattach: function(instance, component) {
          if (this._jsPlumb.div != null) {
            instance.getContainer().appendChild(this._jsPlumb.div);
          }
          this.detached = false;
        },
        computeMaxSize: function() {
          var td = _getDimensions(this);
          return Math.max(td[0], td[1]);
        },
        paint: function(p, containerExtents) {
          if (!this._jsPlumb.initialised) {
            this.getElement();
            p.component.appendDisplayElement(this._jsPlumb.div);
            this._jsPlumb.initialised = true;
            if (this.detached) {
              this._jsPlumb.div.parentNode.removeChild(this._jsPlumb.div);
            }
          }
          this._jsPlumb.div.style.left = p.component.x + p.d.minx + "px";
          this._jsPlumb.div.style.top = p.component.y + p.d.miny + "px";
        }
      });
      _jp.Overlays.Custom = function(params) {
        this.type = "Custom";
        AbstractDOMOverlay.apply(this, arguments);
      };
      _ju.extend(_jp.Overlays.Custom, AbstractDOMOverlay);
      _jp.Overlays.GuideLines = function() {
        var self = this;
        self.length = 50;
        self.strokeWidth = 5;
        this.type = "GuideLines";
        AbstractOverlay.apply(this, arguments);
        _jp.jsPlumbUIComponent.apply(this, arguments);
        this.draw = function(connector, currentConnectionPaintStyle) {
          var head = connector.pointAlongPathFrom(self.loc, self.length / 2), mid = connector.pointOnPath(self.loc), tail = _jg.pointOnLine(head, mid, self.length), tailLine = _jg.perpendicularLineTo(head, tail, 40), headLine = _jg.perpendicularLineTo(tail, head, 20);
          return {
            connector,
            head,
            tail,
            headLine,
            tailLine,
            minX: Math.min(head.x, tail.x, headLine[0].x, headLine[1].x),
            minY: Math.min(head.y, tail.y, headLine[0].y, headLine[1].y),
            maxX: Math.max(head.x, tail.x, headLine[0].x, headLine[1].x),
            maxY: Math.max(head.y, tail.y, headLine[0].y, headLine[1].y)
          };
        };
      };
      _jp.Overlays.Label = function(params) {
        this.labelStyle = params.labelStyle;
        this.cssClass = this.labelStyle != null ? this.labelStyle.cssClass : null;
        var p = _jp.extend({
          create: function() {
            return _jp.createElement("div");
          }
        }, params);
        _jp.Overlays.Custom.call(this, p);
        this.type = "Label";
        this.label = params.label || "";
        this.labelText = null;
        if (this.labelStyle) {
          var el = this.getElement();
          this.labelStyle.font = this.labelStyle.font || "12px sans-serif";
          el.style.font = this.labelStyle.font;
          el.style.color = this.labelStyle.color || "black";
          if (this.labelStyle.fill) {
            el.style.background = this.labelStyle.fill;
          }
          if (this.labelStyle.borderWidth > 0) {
            var dStyle = this.labelStyle.borderStyle ? this.labelStyle.borderStyle : "black";
            el.style.border = this.labelStyle.borderWidth + "px solid " + dStyle;
          }
          if (this.labelStyle.padding) {
            el.style.padding = this.labelStyle.padding;
          }
        }
      };
      _ju.extend(_jp.Overlays.Label, _jp.Overlays.Custom, {
        cleanup: function(force) {
          if (force) {
            this.div = null;
            this.label = null;
            this.labelText = null;
            this.cssClass = null;
            this.labelStyle = null;
          }
        },
        getLabel: function() {
          return this.label;
        },
        /*
         * Function: setLabel
         * sets the label's, um, label.  you would think i'd call this function
         * 'setText', but you can pass either a Function or a String to this, so
         * it makes more sense as 'setLabel'. This uses innerHTML on the label div, so keep
         * that in mind if you need escaped HTML.
         */
        setLabel: function(l) {
          this.label = l;
          this.labelText = null;
          this.clearCachedDimensions();
          this.update();
          this.component.repaint();
        },
        getDimensions: function() {
          this.update();
          return AbstractDOMOverlay.prototype.getDimensions.apply(this, arguments);
        },
        update: function() {
          if (typeof this.label === "function") {
            var lt = this.label(this);
            this.getElement().innerHTML = lt.replace(/\r\n/g, "<br/>");
          } else {
            if (this.labelText == null) {
              this.labelText = this.label;
              this.getElement().innerHTML = this.labelText.replace(/\r\n/g, "<br/>");
            }
          }
        },
        updateFrom: function(d) {
          if (d.label != null) {
            this.setLabel(d.label);
          }
        }
      });
    }).call(typeof window !== "undefined" ? window : jsplumb);
    (function() {
      var root = this, _ju = root.jsPlumbUtil, _jpi = root.jsPlumbInstance;
      var GROUP_COLLAPSED_CLASS = "jtk-group-collapsed";
      var GROUP_EXPANDED_CLASS = "jtk-group-expanded";
      var GROUP_CONTAINER_SELECTOR = "[jtk-group-content]";
      var ELEMENT_DRAGGABLE_EVENT = "elementDraggable";
      var STOP = "stop";
      var REVERT = "revert";
      var GROUP_MANAGER = "_groupManager";
      var GROUP = "_jsPlumbGroup";
      var GROUP_DRAG_SCOPE = "_jsPlumbGroupDrag";
      var EVT_CHILD_ADDED = "group:addMember";
      var EVT_CHILD_REMOVED = "group:removeMember";
      var EVT_GROUP_ADDED = "group:add";
      var EVT_GROUP_REMOVED = "group:remove";
      var EVT_EXPAND = "group:expand";
      var EVT_COLLAPSE = "group:collapse";
      var EVT_GROUP_DRAG_STOP = "groupDragStop";
      var EVT_CONNECTION_MOVED = "connectionMoved";
      var EVT_INTERNAL_CONNECTION_DETACHED = "internal.connectionDetached";
      var CMD_REMOVE_ALL = "removeAll";
      var CMD_ORPHAN_ALL = "orphanAll";
      var CMD_SHOW = "show";
      var CMD_HIDE = "hide";
      var GroupManager = function(_jsPlumb) {
        var _managedGroups = {}, _connectionSourceMap = {}, _connectionTargetMap = {}, self = this;
        function isDescendant(el, parentEl) {
          var c = _jsPlumb.getContainer();
          var abort = false;
          while (!abort) {
            if (el == null || el === c) {
              return false;
            } else {
              if (el === parentEl) {
                return true;
              } else {
                el = el.parentNode;
              }
            }
          }
        }
        _jsPlumb.bind("connection", function(p) {
          var sourceGroup = _jsPlumb.getGroupFor(p.source);
          var targetGroup = _jsPlumb.getGroupFor(p.target);
          if (sourceGroup != null && targetGroup != null && sourceGroup === targetGroup) {
            _connectionSourceMap[p.connection.id] = sourceGroup;
            _connectionTargetMap[p.connection.id] = sourceGroup;
          } else {
            if (sourceGroup != null) {
              _ju.suggest(sourceGroup.connections.source, p.connection);
              _connectionSourceMap[p.connection.id] = sourceGroup;
            }
            if (targetGroup != null) {
              _ju.suggest(targetGroup.connections.target, p.connection);
              _connectionTargetMap[p.connection.id] = targetGroup;
            }
          }
        });
        function _cleanupDetachedConnection(conn) {
          delete conn.proxies;
          var group = _connectionSourceMap[conn.id], f;
          if (group != null) {
            f = function(c) {
              return c.id === conn.id;
            };
            _ju.removeWithFunction(group.connections.source, f);
            _ju.removeWithFunction(group.connections.target, f);
            delete _connectionSourceMap[conn.id];
          }
          group = _connectionTargetMap[conn.id];
          if (group != null) {
            f = function(c) {
              return c.id === conn.id;
            };
            _ju.removeWithFunction(group.connections.source, f);
            _ju.removeWithFunction(group.connections.target, f);
            delete _connectionTargetMap[conn.id];
          }
        }
        _jsPlumb.bind(EVT_INTERNAL_CONNECTION_DETACHED, function(p) {
          _cleanupDetachedConnection(p.connection);
        });
        _jsPlumb.bind(EVT_CONNECTION_MOVED, function(p) {
          var connMap = p.index === 0 ? _connectionSourceMap : _connectionTargetMap;
          var group = connMap[p.connection.id];
          if (group) {
            var list = group.connections[p.index === 0 ? "source" : "target"];
            var idx = list.indexOf(p.connection);
            if (idx !== -1) {
              list.splice(idx, 1);
            }
          }
        });
        this.addGroup = function(group) {
          _jsPlumb.addClass(group.getEl(), GROUP_EXPANDED_CLASS);
          _managedGroups[group.id] = group;
          group.manager = this;
          _updateConnectionsForGroup(group);
          _jsPlumb.fire(EVT_GROUP_ADDED, { group });
        };
        this.addToGroup = function(group, el, doNotFireEvent) {
          group = this.getGroup(group);
          if (group) {
            var groupEl = group.getEl();
            if (el._isJsPlumbGroup) {
              return;
            }
            var currentGroup = el._jsPlumbGroup;
            if (currentGroup !== group) {
              _jsPlumb.removeFromDragSelection(el);
              var elpos = _jsPlumb.getOffset(el, true);
              var cpos = group.collapsed ? _jsPlumb.getOffset(groupEl, true) : _jsPlumb.getOffset(group.getDragArea(), true);
              if (currentGroup != null) {
                currentGroup.remove(el, false, doNotFireEvent, false, group);
                self.updateConnectionsForGroup(currentGroup);
              }
              group.add(
                el,
                doNotFireEvent
                /*, currentGroup*/
              );
              var handleDroppedConnections = function(list, index) {
                var oidx = index === 0 ? 1 : 0;
                list.each(function(c) {
                  c.setVisible(false);
                  if (c.endpoints[oidx].element._jsPlumbGroup === group) {
                    c.endpoints[oidx].setVisible(false);
                    _expandConnection(c, oidx, group);
                  } else {
                    c.endpoints[index].setVisible(false);
                    _collapseConnection(c, index, group);
                  }
                });
              };
              if (group.collapsed) {
                handleDroppedConnections(_jsPlumb.select({ source: el }), 0);
                handleDroppedConnections(_jsPlumb.select({ target: el }), 1);
              }
              var elId = _jsPlumb.getId(el);
              _jsPlumb.dragManager.setParent(el, elId, groupEl, _jsPlumb.getId(groupEl), elpos);
              var newPosition = { left: elpos.left - cpos.left, top: elpos.top - cpos.top };
              _jsPlumb.setPosition(el, newPosition);
              _jsPlumb.dragManager.revalidateParent(el, elId, elpos);
              self.updateConnectionsForGroup(group);
              _jsPlumb.revalidate(elId);
              if (!doNotFireEvent) {
                var p = { group, el, pos: newPosition };
                if (currentGroup) {
                  p.sourceGroup = currentGroup;
                }
                _jsPlumb.fire(EVT_CHILD_ADDED, p);
              }
            }
          }
        };
        this.removeFromGroup = function(group, el, doNotFireEvent) {
          group = this.getGroup(group);
          if (group) {
            if (group.collapsed) {
              var _expandSet = function(conns, index) {
                for (var i = 0; i < conns.length; i++) {
                  var c = conns[i];
                  if (c.proxies) {
                    for (var j = 0; j < c.proxies.length; j++) {
                      if (c.proxies[j] != null) {
                        var proxiedElement = c.proxies[j].originalEp.element;
                        if (proxiedElement === el || isDescendant(proxiedElement, el)) {
                          _expandConnection(c, index, group);
                        }
                      }
                    }
                  }
                }
              };
              _expandSet(group.connections.source.slice(), 0);
              _expandSet(group.connections.target.slice(), 1);
            }
            group.remove(el, null, doNotFireEvent);
          }
        };
        this.getGroup = function(groupId) {
          var group = groupId;
          if (_ju.isString(groupId)) {
            group = _managedGroups[groupId];
            if (group == null) {
              throw new TypeError("No such group [" + groupId + "]");
            }
          }
          return group;
        };
        this.getGroups = function() {
          var o = [];
          for (var g in _managedGroups) {
            o.push(_managedGroups[g]);
          }
          return o;
        };
        this.removeGroup = function(group, deleteMembers, manipulateDOM, doNotFireEvent) {
          group = this.getGroup(group);
          this.expandGroup(group, true);
          var newPositions = group[deleteMembers ? CMD_REMOVE_ALL : CMD_ORPHAN_ALL](manipulateDOM, doNotFireEvent);
          _jsPlumb.remove(group.getEl());
          delete _managedGroups[group.id];
          delete _jsPlumb._groups[group.id];
          _jsPlumb.fire(EVT_GROUP_REMOVED, { group });
          return newPositions;
        };
        this.removeAllGroups = function(deleteMembers, manipulateDOM, doNotFireEvent) {
          for (var g in _managedGroups) {
            this.removeGroup(_managedGroups[g], deleteMembers, manipulateDOM, doNotFireEvent);
          }
        };
        function _setVisible(group, state) {
          var m = group.getEl().querySelectorAll(".jtk-managed");
          for (var i = 0; i < m.length; i++) {
            _jsPlumb[state ? CMD_SHOW : CMD_HIDE](m[i], true);
          }
        }
        var _collapseConnection = function(c, index, group) {
          var otherEl = c.endpoints[index === 0 ? 1 : 0].element;
          if (otherEl[GROUP] && (!otherEl[GROUP].shouldProxy() && otherEl[GROUP].collapsed)) {
            return;
          }
          var groupEl = group.getEl(), groupElId = _jsPlumb.getId(groupEl);
          _jsPlumb.proxyConnection(c, index, groupEl, groupElId, function(c2, index2) {
            return group.getEndpoint(c2, index2);
          }, function(c2, index2) {
            return group.getAnchor(c2, index2);
          });
        };
        this.collapseGroup = function(group) {
          group = this.getGroup(group);
          if (group == null || group.collapsed) {
            return;
          }
          var groupEl = group.getEl();
          _setVisible(group, false);
          if (group.shouldProxy()) {
            var _collapseSet = function(conns, index) {
              for (var i = 0; i < conns.length; i++) {
                var c = conns[i];
                _collapseConnection(c, index, group);
              }
            };
            _collapseSet(group.connections.source, 0);
            _collapseSet(group.connections.target, 1);
          }
          group.collapsed = true;
          _jsPlumb.removeClass(groupEl, GROUP_EXPANDED_CLASS);
          _jsPlumb.addClass(groupEl, GROUP_COLLAPSED_CLASS);
          _jsPlumb.revalidate(groupEl);
          _jsPlumb.fire(EVT_COLLAPSE, { group });
        };
        var _expandConnection = function(c, index, group) {
          _jsPlumb.unproxyConnection(c, index, _jsPlumb.getId(group.getEl()));
        };
        this.expandGroup = function(group, doNotFireEvent) {
          group = this.getGroup(group);
          if (group == null || !group.collapsed) {
            return;
          }
          var groupEl = group.getEl();
          _setVisible(group, true);
          if (group.shouldProxy()) {
            var _expandSet = function(conns, index) {
              for (var i = 0; i < conns.length; i++) {
                var c = conns[i];
                _expandConnection(c, index, group);
              }
            };
            _expandSet(group.connections.source, 0);
            _expandSet(group.connections.target, 1);
          }
          group.collapsed = false;
          _jsPlumb.addClass(groupEl, GROUP_EXPANDED_CLASS);
          _jsPlumb.removeClass(groupEl, GROUP_COLLAPSED_CLASS);
          _jsPlumb.revalidate(groupEl);
          this.repaintGroup(group);
          if (!doNotFireEvent) {
            _jsPlumb.fire(EVT_EXPAND, { group });
          }
        };
        this.repaintGroup = function(group) {
          group = this.getGroup(group);
          var m = group.getMembers();
          for (var i = 0; i < m.length; i++) {
            _jsPlumb.revalidate(m[i]);
          }
        };
        function _updateConnectionsForGroup(group) {
          var members = group.getMembers().slice();
          var childMembers = [];
          for (var i = 0; i < members.length; i++) {
            Array.prototype.push.apply(childMembers, members[i].querySelectorAll(".jtk-managed"));
          }
          Array.prototype.push.apply(members, childMembers);
          var c1 = _jsPlumb.getConnections({ source: members, scope: "*" }, true);
          var c2 = _jsPlumb.getConnections({ target: members, scope: "*" }, true);
          var processed = {};
          group.connections.source.length = 0;
          group.connections.target.length = 0;
          var oneSet = function(c) {
            for (var i2 = 0; i2 < c.length; i2++) {
              if (processed[c[i2].id]) {
                continue;
              }
              processed[c[i2].id] = true;
              var gs = _jsPlumb.getGroupFor(c[i2].source), gt = _jsPlumb.getGroupFor(c[i2].target);
              if (gs === group) {
                if (gt !== group) {
                  group.connections.source.push(c[i2]);
                }
                _connectionSourceMap[c[i2].id] = group;
              } else if (gt === group) {
                group.connections.target.push(c[i2]);
                _connectionTargetMap[c[i2].id] = group;
              }
            }
          };
          oneSet(c1);
          oneSet(c2);
        }
        this.updateConnectionsForGroup = _updateConnectionsForGroup;
        this.refreshAllGroups = function() {
          for (var g in _managedGroups) {
            _updateConnectionsForGroup(_managedGroups[g]);
            _jsPlumb.dragManager.updateOffsets(_jsPlumb.getId(_managedGroups[g].getEl()));
          }
        };
      };
      var Group = function(_jsPlumb, params) {
        var self = this;
        var el = params.el;
        this.getEl = function() {
          return el;
        };
        this.id = params.id || _ju.uuid();
        el._isJsPlumbGroup = true;
        var getDragArea = this.getDragArea = function() {
          var da = _jsPlumb.getSelector(el, GROUP_CONTAINER_SELECTOR);
          return da && da.length > 0 ? da[0] : el;
        };
        var ghost = params.ghost === true;
        var constrain = ghost || params.constrain === true;
        var revert = params.revert !== false;
        var orphan = params.orphan === true;
        var prune = params.prune === true;
        var dropOverride = params.dropOverride === true;
        var proxied = params.proxied !== false;
        var elements = [];
        this.connections = { source: [], target: [], internal: [] };
        this.getAnchor = function(conn, endpointIndex) {
          return params.anchor || "Continuous";
        };
        this.getEndpoint = function(conn, endpointIndex) {
          return params.endpoint || ["Dot", { radius: 10 }];
        };
        this.collapsed = false;
        if (params.draggable !== false) {
          var opts = {
            drag: function() {
              for (var i = 0; i < elements.length; i++) {
                _jsPlumb.draw(elements[i]);
              }
            },
            stop: function(params2) {
              _jsPlumb.fire(EVT_GROUP_DRAG_STOP, jsPlumb.extend(params2, { group: self }));
            },
            scope: GROUP_DRAG_SCOPE
          };
          if (params.dragOptions) {
            root.jsPlumb.extend(opts, params.dragOptions);
          }
          _jsPlumb.draggable(params.el, opts);
        }
        if (params.droppable !== false) {
          _jsPlumb.droppable(params.el, {
            drop: function(p) {
              var el2 = p.drag.el;
              if (el2._isJsPlumbGroup) {
                return;
              }
              var currentGroup = el2._jsPlumbGroup;
              if (currentGroup !== self) {
                if (currentGroup != null) {
                  if (currentGroup.overrideDrop(el2, self)) {
                    return;
                  }
                }
                _jsPlumb.getGroupManager().addToGroup(self, el2, false);
              }
            }
          });
        }
        var _each = function(_el, fn) {
          var els = _el.nodeType == null ? _el : [_el];
          for (var i = 0; i < els.length; i++) {
            fn(els[i]);
          }
        };
        this.overrideDrop = function(_el, targetGroup) {
          return dropOverride && (revert || prune || orphan);
        };
        this.add = function(_el, doNotFireEvent) {
          var dragArea = getDragArea();
          _each(_el, function(__el) {
            if (__el._jsPlumbGroup != null) {
              if (__el._jsPlumbGroup === self) {
                return;
              } else {
                __el._jsPlumbGroup.remove(__el, true, doNotFireEvent, false);
              }
            }
            __el._jsPlumbGroup = self;
            elements.push(__el);
            if (_jsPlumb.isAlreadyDraggable(__el)) {
              _bindDragHandlers(__el);
            }
            if (__el.parentNode !== dragArea) {
              dragArea.appendChild(__el);
            }
          });
          _jsPlumb.getGroupManager().updateConnectionsForGroup(self);
        };
        this.remove = function(el2, manipulateDOM, doNotFireEvent, doNotUpdateConnections, targetGroup) {
          _each(el2, function(__el) {
            if (__el._jsPlumbGroup === self) {
              delete __el._jsPlumbGroup;
              _ju.removeWithFunction(elements, function(e) {
                return e === __el;
              });
              if (manipulateDOM) {
                try {
                  self.getDragArea().removeChild(__el);
                } catch (e) {
                  jsPlumbUtil.log("Could not remove element from Group " + e);
                }
              }
              _unbindDragHandlers(__el);
              if (!doNotFireEvent) {
                var p = { group: self, el: __el };
                if (targetGroup) {
                  p.targetGroup = targetGroup;
                }
                _jsPlumb.fire(EVT_CHILD_REMOVED, p);
              }
            }
          });
          if (!doNotUpdateConnections) {
            _jsPlumb.getGroupManager().updateConnectionsForGroup(self);
          }
        };
        this.removeAll = function(manipulateDOM, doNotFireEvent) {
          for (var i = 0, l = elements.length; i < l; i++) {
            var el2 = elements[0];
            self.remove(el2, manipulateDOM, doNotFireEvent, true);
            _jsPlumb.remove(el2, true);
          }
          elements.length = 0;
          _jsPlumb.getGroupManager().updateConnectionsForGroup(self);
        };
        this.orphanAll = function() {
          var orphanedPositions = {};
          for (var i = 0; i < elements.length; i++) {
            var newPosition = _orphan(elements[i]);
            orphanedPositions[newPosition[0]] = newPosition[1];
          }
          elements.length = 0;
          return orphanedPositions;
        };
        this.getMembers = function() {
          return elements;
        };
        el[GROUP] = this;
        _jsPlumb.bind(ELEMENT_DRAGGABLE_EVENT, (function(dragParams) {
          if (dragParams.el._jsPlumbGroup === this) {
            _bindDragHandlers(dragParams.el);
          }
        }).bind(this));
        function _findParent(_el) {
          return _el.offsetParent;
        }
        function _isInsideParent(_el, pos) {
          var p = _findParent(_el), s = _jsPlumb.getSize(p), ss = _jsPlumb.getSize(_el), leftEdge = pos[0], rightEdge = leftEdge + ss[0], topEdge = pos[1], bottomEdge = topEdge + ss[1];
          return rightEdge > 0 && leftEdge < s[0] && bottomEdge > 0 && topEdge < s[1];
        }
        function _orphan(_el) {
          var id = _jsPlumb.getId(_el);
          var pos = _jsPlumb.getOffset(_el);
          _el.parentNode.removeChild(_el);
          _jsPlumb.getContainer().appendChild(_el);
          _jsPlumb.setPosition(_el, pos);
          _unbindDragHandlers(_el);
          _jsPlumb.dragManager.clearParent(_el, id);
          return [id, pos];
        }
        function _pruneOrOrphan(p) {
          var out = [];
          function _one(el2, left, top) {
            var orphanedPosition = null;
            if (!_isInsideParent(el2, [left, top])) {
              var group = el2._jsPlumbGroup;
              if (prune) {
                _jsPlumb.remove(el2);
              } else {
                orphanedPosition = _orphan(el2);
              }
              group.remove(el2);
            }
            return orphanedPosition;
          }
          for (var i = 0; i < p.selection.length; i++) {
            out.push(_one(p.selection[i][0], p.selection[i][1].left, p.selection[i][1].top));
          }
          return out.length === 1 ? out[0] : out;
        }
        function _revalidate(_el) {
          var id = _jsPlumb.getId(_el);
          _jsPlumb.revalidate(_el);
          _jsPlumb.dragManager.revalidateParent(_el, id);
        }
        function _unbindDragHandlers(_el) {
          if (!_el._katavorioDrag) {
            return;
          }
          if (prune || orphan) {
            _el._katavorioDrag.off(STOP, _pruneOrOrphan);
          }
          if (!prune && !orphan && revert) {
            _el._katavorioDrag.off(REVERT, _revalidate);
            _el._katavorioDrag.setRevert(null);
          }
        }
        function _bindDragHandlers(_el) {
          if (!_el._katavorioDrag) {
            return;
          }
          if (prune || orphan) {
            _el._katavorioDrag.on(STOP, _pruneOrOrphan);
          }
          if (constrain) {
            _el._katavorioDrag.setConstrain(true);
          }
          if (ghost) {
            _el._katavorioDrag.setUseGhostProxy(true);
          }
          if (!prune && !orphan && revert) {
            _el._katavorioDrag.on(REVERT, _revalidate);
            _el._katavorioDrag.setRevert(function(__el, pos) {
              return !_isInsideParent(__el, pos);
            });
          }
        }
        this.shouldProxy = function() {
          return proxied;
        };
        _jsPlumb.getGroupManager().addGroup(this);
      };
      _jpi.prototype.addGroup = function(params) {
        var j = this;
        j._groups = j._groups || {};
        if (j._groups[params.id] != null) {
          throw new TypeError("cannot create Group [" + params.id + "]; a Group with that ID exists");
        }
        if (params.el[GROUP] != null) {
          throw new TypeError("cannot create Group [" + params.id + "]; the given element is already a Group");
        }
        var group = new Group(j, params);
        j._groups[group.id] = group;
        if (params.collapsed) {
          this.collapseGroup(group);
        }
        return group;
      };
      _jpi.prototype.addToGroup = function(group, el, doNotFireEvent) {
        var _one = (function(_el) {
          var id = this.getId(_el);
          this.manage(id, _el);
          this.getGroupManager().addToGroup(group, _el, doNotFireEvent);
        }).bind(this);
        if (Array.isArray(el)) {
          for (var i = 0; i < el.length; i++) {
            _one(el[i]);
          }
        } else {
          _one(el);
        }
      };
      _jpi.prototype.removeFromGroup = function(group, el, doNotFireEvent) {
        this.getGroupManager().removeFromGroup(group, el, doNotFireEvent);
        this.getContainer().appendChild(el);
      };
      _jpi.prototype.removeGroup = function(group, deleteMembers, manipulateDOM, doNotFireEvent) {
        return this.getGroupManager().removeGroup(group, deleteMembers, manipulateDOM, doNotFireEvent);
      };
      _jpi.prototype.removeAllGroups = function(deleteMembers, manipulateDOM, doNotFireEvent) {
        this.getGroupManager().removeAllGroups(deleteMembers, manipulateDOM, doNotFireEvent);
      };
      _jpi.prototype.getGroup = function(groupId) {
        return this.getGroupManager().getGroup(groupId);
      };
      _jpi.prototype.getGroups = function() {
        return this.getGroupManager().getGroups();
      };
      _jpi.prototype.expandGroup = function(group) {
        this.getGroupManager().expandGroup(group);
      };
      _jpi.prototype.collapseGroup = function(groupId) {
        this.getGroupManager().collapseGroup(groupId);
      };
      _jpi.prototype.repaintGroup = function(group) {
        this.getGroupManager().repaintGroup(group);
      };
      _jpi.prototype.toggleGroup = function(group) {
        group = this.getGroupManager().getGroup(group);
        if (group != null) {
          this.getGroupManager()[group.collapsed ? "expandGroup" : "collapseGroup"](group);
        }
      };
      _jpi.prototype.getGroupManager = function() {
        var mgr = this[GROUP_MANAGER];
        if (mgr == null) {
          mgr = this[GROUP_MANAGER] = new GroupManager(this);
        }
        return mgr;
      };
      _jpi.prototype.removeGroupManager = function() {
        delete this[GROUP_MANAGER];
      };
      _jpi.prototype.getGroupFor = function(el) {
        el = this.getElement(el);
        if (el) {
          var c = this.getContainer();
          var abort = false, g = null;
          while (!abort) {
            if (el == null || el === c) {
              abort = true;
            } else {
              if (el[GROUP]) {
                g = el[GROUP];
                abort = true;
              } else {
                el = el.parentNode;
              }
            }
          }
          return g;
        }
      };
    }).call(typeof window !== "undefined" ? window : jsplumb);
    (function() {
      var root = this, _jp = root.jsPlumb, _ju = root.jsPlumbUtil;
      var STRAIGHT = "Straight";
      var ARC = "Arc";
      var Flowchart = function(params) {
        this.type = "Flowchart";
        params = params || {};
        params.stub = params.stub == null ? 30 : params.stub;
        var segments, _super = _jp.Connectors.AbstractConnector.apply(this, arguments), midpoint = params.midpoint == null || isNaN(params.midpoint) ? 0.5 : params.midpoint, alwaysRespectStubs = params.alwaysRespectStubs === true, lastx = null, lasty = null, cornerRadius = params.cornerRadius != null ? params.cornerRadius : 0;
        params.loopbackRadius || 25;
        var sgn = function(n) {
          return n < 0 ? -1 : n === 0 ? 0 : 1;
        }, segmentDirections = function(segment) {
          return [
            sgn(segment[2] - segment[0]),
            sgn(segment[3] - segment[1])
          ];
        }, addSegment = function(segments2, x, y, paintInfo) {
          if (lastx === x && lasty === y) {
            return;
          }
          var lx = lastx == null ? paintInfo.sx : lastx, ly = lasty == null ? paintInfo.sy : lasty, o = lx === x ? "v" : "h";
          lastx = x;
          lasty = y;
          segments2.push([lx, ly, x, y, o]);
        }, segLength = function(s) {
          return Math.sqrt(Math.pow(s[0] - s[2], 2) + Math.pow(s[1] - s[3], 2));
        }, _cloneArray = function(a) {
          var _a = [];
          _a.push.apply(_a, a);
          return _a;
        }, writeSegments = function(conn, segments2, paintInfo) {
          var current = null, next, currentDirection, nextDirection;
          for (var i = 0; i < segments2.length - 1; i++) {
            current = current || _cloneArray(segments2[i]);
            next = _cloneArray(segments2[i + 1]);
            currentDirection = segmentDirections(current);
            nextDirection = segmentDirections(next);
            if (cornerRadius > 0 && current[4] !== next[4]) {
              var minSegLength = Math.min(segLength(current), segLength(next));
              var radiusToUse = Math.min(cornerRadius, minSegLength / 2);
              current[2] -= currentDirection[0] * radiusToUse;
              current[3] -= currentDirection[1] * radiusToUse;
              next[0] += nextDirection[0] * radiusToUse;
              next[1] += nextDirection[1] * radiusToUse;
              var ac = currentDirection[1] === nextDirection[0] && nextDirection[0] === 1 || currentDirection[1] === nextDirection[0] && nextDirection[0] === 0 && currentDirection[0] !== nextDirection[1] || currentDirection[1] === nextDirection[0] && nextDirection[0] === -1, sgny = next[1] > current[3] ? 1 : -1, sgnx = next[0] > current[2] ? 1 : -1, sgnEqual = sgny === sgnx, cx = sgnEqual && ac || !sgnEqual && !ac ? next[0] : current[2], cy = sgnEqual && ac || !sgnEqual && !ac ? current[3] : next[1];
              _super.addSegment(conn, STRAIGHT, {
                x1: current[0],
                y1: current[1],
                x2: current[2],
                y2: current[3]
              });
              _super.addSegment(conn, ARC, {
                r: radiusToUse,
                x1: current[2],
                y1: current[3],
                x2: next[0],
                y2: next[1],
                cx,
                cy,
                ac
              });
            } else {
              var dx = current[2] === current[0] ? 0 : current[2] > current[0] ? paintInfo.lw / 2 : -(paintInfo.lw / 2), dy = current[3] === current[1] ? 0 : current[3] > current[1] ? paintInfo.lw / 2 : -(paintInfo.lw / 2);
              _super.addSegment(conn, STRAIGHT, {
                x1: current[0] - dx,
                y1: current[1] - dy,
                x2: current[2] + dx,
                y2: current[3] + dy
              });
            }
            current = next;
          }
          if (next != null) {
            _super.addSegment(conn, STRAIGHT, {
              x1: next[0],
              y1: next[1],
              x2: next[2],
              y2: next[3]
            });
          }
        };
        this.midpoint = midpoint;
        this._compute = function(paintInfo, params2) {
          segments = [];
          lastx = null;
          lasty = null;
          var commonStubCalculator = function() {
            return [paintInfo.startStubX, paintInfo.startStubY, paintInfo.endStubX, paintInfo.endStubY];
          }, stubCalculators = {
            perpendicular: commonStubCalculator,
            orthogonal: commonStubCalculator,
            opposite: function(axis) {
              var pi = paintInfo, idx2 = axis === "x" ? 0 : 1, areInProximity = {
                "x": function() {
                  return pi.so[idx2] === 1 && (pi.startStubX > pi.endStubX && pi.tx > pi.startStubX || pi.sx > pi.endStubX && pi.tx > pi.sx) || pi.so[idx2] === -1 && (pi.startStubX < pi.endStubX && pi.tx < pi.startStubX || pi.sx < pi.endStubX && pi.tx < pi.sx);
                },
                "y": function() {
                  return pi.so[idx2] === 1 && (pi.startStubY > pi.endStubY && pi.ty > pi.startStubY || pi.sy > pi.endStubY && pi.ty > pi.sy) || pi.so[idx2] === -1 && (pi.startStubY < pi.endStubY && pi.ty < pi.startStubY || pi.sy < pi.endStubY && pi.ty < pi.sy);
                }
              };
              if (!alwaysRespectStubs && areInProximity[axis]()) {
                return {
                  "x": [(paintInfo.sx + paintInfo.tx) / 2, paintInfo.startStubY, (paintInfo.sx + paintInfo.tx) / 2, paintInfo.endStubY],
                  "y": [paintInfo.startStubX, (paintInfo.sy + paintInfo.ty) / 2, paintInfo.endStubX, (paintInfo.sy + paintInfo.ty) / 2]
                }[axis];
              } else {
                return [paintInfo.startStubX, paintInfo.startStubY, paintInfo.endStubX, paintInfo.endStubY];
              }
            }
          };
          var stubs = stubCalculators[paintInfo.anchorOrientation](paintInfo.sourceAxis), idx = paintInfo.sourceAxis === "x" ? 0 : 1, oidx = paintInfo.sourceAxis === "x" ? 1 : 0, ss = stubs[idx], oss = stubs[oidx], es = stubs[idx + 2], oes = stubs[oidx + 2];
          addSegment(segments, stubs[0], stubs[1], paintInfo);
          var midx = paintInfo.startStubX + (paintInfo.endStubX - paintInfo.startStubX) * midpoint, midy = paintInfo.startStubY + (paintInfo.endStubY - paintInfo.startStubY) * midpoint;
          var orientations = { x: [0, 1], y: [1, 0] }, lineCalculators = {
            perpendicular: function(axis) {
              var pi = paintInfo, sis = {
                x: [
                  [[1, 2, 3, 4], null, [2, 1, 4, 3]],
                  null,
                  [[4, 3, 2, 1], null, [3, 4, 1, 2]]
                ],
                y: [
                  [[3, 2, 1, 4], null, [2, 3, 4, 1]],
                  null,
                  [[4, 1, 2, 3], null, [1, 4, 3, 2]]
                ]
              }, stubs2 = {
                x: [[pi.startStubX, pi.endStubX], null, [pi.endStubX, pi.startStubX]],
                y: [[pi.startStubY, pi.endStubY], null, [pi.endStubY, pi.startStubY]]
              }, midLines = {
                x: [[midx, pi.startStubY], [midx, pi.endStubY]],
                y: [[pi.startStubX, midy], [pi.endStubX, midy]]
              }, linesToEnd = {
                x: [[pi.endStubX, pi.startStubY]],
                y: [[pi.startStubX, pi.endStubY]]
              }, startToEnd = {
                x: [[pi.startStubX, pi.endStubY], [pi.endStubX, pi.endStubY]],
                y: [[pi.endStubX, pi.startStubY], [pi.endStubX, pi.endStubY]]
              }, startToMidToEnd = {
                x: [[pi.startStubX, midy], [pi.endStubX, midy], [pi.endStubX, pi.endStubY]],
                y: [[midx, pi.startStubY], [midx, pi.endStubY], [pi.endStubX, pi.endStubY]]
              }, otherStubs = {
                x: [pi.startStubY, pi.endStubY],
                y: [pi.startStubX, pi.endStubX]
              }, soIdx = orientations[axis][0], toIdx = orientations[axis][1], _so = pi.so[soIdx] + 1, _to = pi.to[toIdx] + 1, otherFlipped = pi.to[toIdx] === -1 && otherStubs[axis][1] < otherStubs[axis][0] || pi.to[toIdx] === 1 && otherStubs[axis][1] > otherStubs[axis][0], stub1 = stubs2[axis][_so][0], stub2 = stubs2[axis][_so][1], segmentIndexes = sis[axis][_so][_to];
              if (pi.segment === segmentIndexes[3] || pi.segment === segmentIndexes[2] && otherFlipped) {
                return midLines[axis];
              } else if (pi.segment === segmentIndexes[2] && stub2 < stub1) {
                return linesToEnd[axis];
              } else if (pi.segment === segmentIndexes[2] && stub2 >= stub1 || pi.segment === segmentIndexes[1] && !otherFlipped) {
                return startToMidToEnd[axis];
              } else if (pi.segment === segmentIndexes[0] || pi.segment === segmentIndexes[1] && otherFlipped) {
                return startToEnd[axis];
              }
            },
            orthogonal: function(axis, startStub, otherStartStub, endStub, otherEndStub) {
              var pi = paintInfo, extent = {
                "x": pi.so[0] === -1 ? Math.min(startStub, endStub) : Math.max(startStub, endStub),
                "y": pi.so[1] === -1 ? Math.min(startStub, endStub) : Math.max(startStub, endStub)
              }[axis];
              return {
                "x": [
                  [extent, otherStartStub],
                  [extent, otherEndStub],
                  [endStub, otherEndStub]
                ],
                "y": [
                  [otherStartStub, extent],
                  [otherEndStub, extent],
                  [otherEndStub, endStub]
                ]
              }[axis];
            },
            opposite: function(axis, ss2, oss2, es2) {
              var pi = paintInfo, otherAxis = { "x": "y", "y": "x" }[axis], dim = { "x": "height", "y": "width" }[axis], comparator = pi["is" + axis.toUpperCase() + "GreaterThanStubTimes2"];
              if (params2.sourceEndpoint.elementId === params2.targetEndpoint.elementId) {
                var _val = oss2 + (1 - params2.sourceEndpoint.anchor[otherAxis]) * params2.sourceInfo[dim] + _super.maxStub;
                return {
                  "x": [
                    [ss2, _val],
                    [es2, _val]
                  ],
                  "y": [
                    [_val, ss2],
                    [_val, es2]
                  ]
                }[axis];
              } else if (!comparator || pi.so[idx] === 1 && ss2 > es2 || pi.so[idx] === -1 && ss2 < es2) {
                return {
                  "x": [
                    [ss2, midy],
                    [es2, midy]
                  ],
                  "y": [
                    [midx, ss2],
                    [midx, es2]
                  ]
                }[axis];
              } else if (pi.so[idx] === 1 && ss2 < es2 || pi.so[idx] === -1 && ss2 > es2) {
                return {
                  "x": [
                    [midx, pi.sy],
                    [midx, pi.ty]
                  ],
                  "y": [
                    [pi.sx, midy],
                    [pi.tx, midy]
                  ]
                }[axis];
              }
            }
          };
          var p = lineCalculators[paintInfo.anchorOrientation](paintInfo.sourceAxis, ss, oss, es, oes);
          if (p) {
            for (var i = 0; i < p.length; i++) {
              addSegment(segments, p[i][0], p[i][1], paintInfo);
            }
          }
          addSegment(segments, stubs[2], stubs[3], paintInfo);
          addSegment(segments, paintInfo.tx, paintInfo.ty, paintInfo);
          writeSegments(this, segments, paintInfo);
        };
      };
      _jp.Connectors.Flowchart = Flowchart;
      _ju.extend(_jp.Connectors.Flowchart, _jp.Connectors.AbstractConnector);
    }).call(typeof window !== "undefined" ? window : jsplumb);
    (function() {
      var root = this, _jp = root.jsPlumb, _ju = root.jsPlumbUtil;
      _jp.Connectors.AbstractBezierConnector = function(params) {
        params = params || {};
        var showLoopback = params.showLoopback !== false;
        params.curviness || 10;
        var margin = params.margin || 5;
        params.proximityLimit || 80;
        var clockwise = params.orientation && params.orientation === "clockwise", loopbackRadius = params.loopbackRadius || 25, _super;
        this._compute = function(paintInfo, p) {
          var sp = p.sourcePos, tp = p.targetPos, _w = Math.abs(sp[0] - tp[0]), _h = Math.abs(sp[1] - tp[1]);
          if (!showLoopback || p.sourceEndpoint.elementId !== p.targetEndpoint.elementId) {
            this._computeBezier(paintInfo, p, sp, tp, _w, _h);
          } else {
            var x1 = p.sourcePos[0], y1 = p.sourcePos[1] - margin, cx = x1, cy = y1 - loopbackRadius, _x = cx - loopbackRadius, _y = cy - loopbackRadius;
            _w = 2 * loopbackRadius;
            _h = 2 * loopbackRadius;
            paintInfo.points[0] = _x;
            paintInfo.points[1] = _y;
            paintInfo.points[2] = _w;
            paintInfo.points[3] = _h;
            _super.addSegment(this, "Arc", {
              loopback: true,
              x1: x1 - _x + 4,
              y1: y1 - _y,
              startAngle: 0,
              endAngle: 2 * Math.PI,
              r: loopbackRadius,
              ac: !clockwise,
              x2: x1 - _x - 4,
              y2: y1 - _y,
              cx: cx - _x,
              cy: cy - _y
            });
          }
        };
        _super = _jp.Connectors.AbstractConnector.apply(this, arguments);
        return _super;
      };
      _ju.extend(_jp.Connectors.AbstractBezierConnector, _jp.Connectors.AbstractConnector);
      var Bezier = function(params) {
        params = params || {};
        this.type = "Bezier";
        var _super = _jp.Connectors.AbstractBezierConnector.apply(this, arguments), majorAnchor = params.curviness || 150, minorAnchor = 10;
        this.getCurviness = function() {
          return majorAnchor;
        };
        this._findControlPoint = function(point, sourceAnchorPosition, targetAnchorPosition, sourceEndpoint, targetEndpoint, soo, too) {
          var perpendicular = soo[0] !== too[0] || soo[1] === too[1], p = [];
          if (!perpendicular) {
            if (soo[0] === 0) {
              p.push(sourceAnchorPosition[0] < targetAnchorPosition[0] ? point[0] + minorAnchor : point[0] - minorAnchor);
            } else {
              p.push(point[0] - majorAnchor * soo[0]);
            }
            if (soo[1] === 0) {
              p.push(sourceAnchorPosition[1] < targetAnchorPosition[1] ? point[1] + minorAnchor : point[1] - minorAnchor);
            } else {
              p.push(point[1] + majorAnchor * too[1]);
            }
          } else {
            if (too[0] === 0) {
              p.push(targetAnchorPosition[0] < sourceAnchorPosition[0] ? point[0] + minorAnchor : point[0] - minorAnchor);
            } else {
              p.push(point[0] + majorAnchor * too[0]);
            }
            if (too[1] === 0) {
              p.push(targetAnchorPosition[1] < sourceAnchorPosition[1] ? point[1] + minorAnchor : point[1] - minorAnchor);
            } else {
              p.push(point[1] + majorAnchor * soo[1]);
            }
          }
          return p;
        };
        this._computeBezier = function(paintInfo, p, sp, tp, _w, _h) {
          var _CP, _CP2, _sx = sp[0] < tp[0] ? _w : 0, _sy = sp[1] < tp[1] ? _h : 0, _tx = sp[0] < tp[0] ? 0 : _w, _ty = sp[1] < tp[1] ? 0 : _h;
          _CP = this._findControlPoint([_sx, _sy], sp, tp, p.sourceEndpoint, p.targetEndpoint, paintInfo.so, paintInfo.to);
          _CP2 = this._findControlPoint([_tx, _ty], tp, sp, p.targetEndpoint, p.sourceEndpoint, paintInfo.to, paintInfo.so);
          _super.addSegment(this, "Bezier", {
            x1: _sx,
            y1: _sy,
            x2: _tx,
            y2: _ty,
            cp1x: _CP[0],
            cp1y: _CP[1],
            cp2x: _CP2[0],
            cp2y: _CP2[1]
          });
        };
      };
      _jp.Connectors.Bezier = Bezier;
      _ju.extend(Bezier, _jp.Connectors.AbstractBezierConnector);
    }).call(typeof window !== "undefined" ? window : jsplumb);
    (function() {
      var root = this, _jp = root.jsPlumb, _ju = root.jsPlumbUtil;
      var _segment = function(x1, y1, x2, y2) {
        if (x1 <= x2 && y2 <= y1) {
          return 1;
        } else if (x1 <= x2 && y1 <= y2) {
          return 2;
        } else if (x2 <= x1 && y2 >= y1) {
          return 3;
        }
        return 4;
      }, _findControlPoint = function(midx, midy, segment, sourceEdge, targetEdge, dx, dy, distance, proximityLimit) {
        if (distance <= proximityLimit) {
          return [midx, midy];
        }
        if (segment === 1) {
          if (sourceEdge[3] <= 0 && targetEdge[3] >= 1) {
            return [midx + (sourceEdge[2] < 0.5 ? -1 * dx : dx), midy];
          } else if (sourceEdge[2] >= 1 && targetEdge[2] <= 0) {
            return [midx, midy + (sourceEdge[3] < 0.5 ? -1 * dy : dy)];
          } else {
            return [midx + -1 * dx, midy + -1 * dy];
          }
        } else if (segment === 2) {
          if (sourceEdge[3] >= 1 && targetEdge[3] <= 0) {
            return [midx + (sourceEdge[2] < 0.5 ? -1 * dx : dx), midy];
          } else if (sourceEdge[2] >= 1 && targetEdge[2] <= 0) {
            return [midx, midy + (sourceEdge[3] < 0.5 ? -1 * dy : dy)];
          } else {
            return [midx + dx, midy + -1 * dy];
          }
        } else if (segment === 3) {
          if (sourceEdge[3] >= 1 && targetEdge[3] <= 0) {
            return [midx + (sourceEdge[2] < 0.5 ? -1 * dx : dx), midy];
          } else if (sourceEdge[2] <= 0 && targetEdge[2] >= 1) {
            return [midx, midy + (sourceEdge[3] < 0.5 ? -1 * dy : dy)];
          } else {
            return [midx + -1 * dx, midy + -1 * dy];
          }
        } else if (segment === 4) {
          if (sourceEdge[3] <= 0 && targetEdge[3] >= 1) {
            return [midx + (sourceEdge[2] < 0.5 ? -1 * dx : dx), midy];
          } else if (sourceEdge[2] <= 0 && targetEdge[2] >= 1) {
            return [midx, midy + (sourceEdge[3] < 0.5 ? -1 * dy : dy)];
          } else {
            return [midx + dx, midy + -1 * dy];
          }
        }
      };
      var StateMachine = function(params) {
        params = params || {};
        this.type = "StateMachine";
        var _super = _jp.Connectors.AbstractBezierConnector.apply(this, arguments), curviness = params.curviness || 10, margin = params.margin || 5, proximityLimit = params.proximityLimit || 80;
        params.orientation && params.orientation === "clockwise";
        var _controlPoint;
        this._computeBezier = function(paintInfo, params2, sp, tp, w, h) {
          var _sx = params2.sourcePos[0] < params2.targetPos[0] ? 0 : w, _sy = params2.sourcePos[1] < params2.targetPos[1] ? 0 : h, _tx = params2.sourcePos[0] < params2.targetPos[0] ? w : 0, _ty = params2.sourcePos[1] < params2.targetPos[1] ? h : 0;
          if (params2.sourcePos[2] === 0) {
            _sx -= margin;
          }
          if (params2.sourcePos[2] === 1) {
            _sx += margin;
          }
          if (params2.sourcePos[3] === 0) {
            _sy -= margin;
          }
          if (params2.sourcePos[3] === 1) {
            _sy += margin;
          }
          if (params2.targetPos[2] === 0) {
            _tx -= margin;
          }
          if (params2.targetPos[2] === 1) {
            _tx += margin;
          }
          if (params2.targetPos[3] === 0) {
            _ty -= margin;
          }
          if (params2.targetPos[3] === 1) {
            _ty += margin;
          }
          var _midx = (_sx + _tx) / 2, _midy = (_sy + _ty) / 2, segment = _segment(_sx, _sy, _tx, _ty), distance = Math.sqrt(Math.pow(_tx - _sx, 2) + Math.pow(_ty - _sy, 2)), cp1x, cp2x, cp1y, cp2y;
          _controlPoint = _findControlPoint(
            _midx,
            _midy,
            segment,
            params2.sourcePos,
            params2.targetPos,
            curviness,
            curviness,
            distance,
            proximityLimit
          );
          cp1x = _controlPoint[0];
          cp2x = _controlPoint[0];
          cp1y = _controlPoint[1];
          cp2y = _controlPoint[1];
          _super.addSegment(this, "Bezier", {
            x1: _tx,
            y1: _ty,
            x2: _sx,
            y2: _sy,
            cp1x,
            cp1y,
            cp2x,
            cp2y
          });
        };
      };
      _jp.Connectors.StateMachine = StateMachine;
      _ju.extend(StateMachine, _jp.Connectors.AbstractBezierConnector);
    }).call(typeof window !== "undefined" ? window : jsplumb);
    (function() {
      var root = this, _jp = root.jsPlumb, _ju = root.jsPlumbUtil;
      var STRAIGHT = "Straight";
      var Straight = function(params) {
        this.type = STRAIGHT;
        var _super = _jp.Connectors.AbstractConnector.apply(this, arguments);
        this._compute = function(paintInfo, _) {
          _super.addSegment(this, STRAIGHT, { x1: paintInfo.sx, y1: paintInfo.sy, x2: paintInfo.startStubX, y2: paintInfo.startStubY });
          _super.addSegment(this, STRAIGHT, { x1: paintInfo.startStubX, y1: paintInfo.startStubY, x2: paintInfo.endStubX, y2: paintInfo.endStubY });
          _super.addSegment(this, STRAIGHT, { x1: paintInfo.endStubX, y1: paintInfo.endStubY, x2: paintInfo.tx, y2: paintInfo.ty });
        };
      };
      _jp.Connectors.Straight = Straight;
      _ju.extend(Straight, _jp.Connectors.AbstractConnector);
    }).call(typeof window !== "undefined" ? window : jsplumb);
    (function() {
      var root = this, _jp = root.jsPlumb, _ju = root.jsPlumbUtil;
      var svgAttributeMap = {
        "stroke-linejoin": "stroke-linejoin",
        "stroke-dashoffset": "stroke-dashoffset",
        "stroke-linecap": "stroke-linecap"
      }, STROKE_DASHARRAY = "stroke-dasharray", DASHSTYLE = "dashstyle", LINEAR_GRADIENT = "linearGradient", RADIAL_GRADIENT = "radialGradient", DEFS = "defs", FILL = "fill", STOP = "stop", STROKE = "stroke", STROKE_WIDTH = "stroke-width", STYLE = "style", NONE = "none", JSPLUMB_GRADIENT = "jsplumb_gradient_", LINE_WIDTH = "strokeWidth", ns = {
        svg: "http://www.w3.org/2000/svg"
      }, _attr = function(node, attributes) {
        for (var i in attributes) {
          node.setAttribute(i, "" + attributes[i]);
        }
      }, _node = function(name, attributes) {
        attributes = attributes || {};
        attributes.version = "1.1";
        attributes.xmlns = ns.svg;
        return _jp.createElementNS(ns.svg, name, null, null, attributes);
      }, _pos = function(d) {
        return "position:absolute;left:" + d[0] + "px;top:" + d[1] + "px";
      }, _clearGradient = function(parent) {
        var els = parent.querySelectorAll(" defs,linearGradient,radialGradient");
        for (var i = 0; i < els.length; i++) {
          els[i].parentNode.removeChild(els[i]);
        }
      }, _updateGradient = function(parent, node, style, dimensions, uiComponent) {
        var id = JSPLUMB_GRADIENT + uiComponent._jsPlumb.instance.idstamp();
        _clearGradient(parent);
        var g;
        if (!style.gradient.offset) {
          g = _node(LINEAR_GRADIENT, { id, gradientUnits: "userSpaceOnUse" });
        } else {
          g = _node(RADIAL_GRADIENT, { id });
        }
        var defs = _node(DEFS);
        parent.appendChild(defs);
        defs.appendChild(g);
        for (var i = 0; i < style.gradient.stops.length; i++) {
          var styleToUse = uiComponent.segment === 1 || uiComponent.segment === 2 ? i : style.gradient.stops.length - 1 - i, stopColor = style.gradient.stops[styleToUse][1], s = _node(STOP, { "offset": Math.floor(style.gradient.stops[i][0] * 100) + "%", "stop-color": stopColor });
          g.appendChild(s);
        }
        var applyGradientTo = style.stroke ? STROKE : FILL;
        node.setAttribute(applyGradientTo, "url(#" + id + ")");
      }, _applyStyles = function(parent, node, style, dimensions, uiComponent) {
        node.setAttribute(FILL, style.fill ? style.fill : NONE);
        node.setAttribute(STROKE, style.stroke ? style.stroke : NONE);
        if (style.gradient) {
          _updateGradient(parent, node, style, dimensions, uiComponent);
        } else {
          _clearGradient(parent);
          node.setAttribute(STYLE, "");
        }
        if (style.strokeWidth) {
          node.setAttribute(STROKE_WIDTH, style.strokeWidth);
        }
        if (style[DASHSTYLE] && style[LINE_WIDTH] && !style[STROKE_DASHARRAY]) {
          var sep = style[DASHSTYLE].indexOf(",") === -1 ? " " : ",", parts = style[DASHSTYLE].split(sep), styleToUse = "";
          parts.forEach(function(p) {
            styleToUse += Math.floor(p * style.strokeWidth) + sep;
          });
          node.setAttribute(STROKE_DASHARRAY, styleToUse);
        } else if (style[STROKE_DASHARRAY]) {
          node.setAttribute(STROKE_DASHARRAY, style[STROKE_DASHARRAY]);
        }
        for (var i in svgAttributeMap) {
          if (style[i]) {
            node.setAttribute(svgAttributeMap[i], style[i]);
          }
        }
      }, _appendAtIndex = function(svg, path, idx) {
        if (svg.childNodes.length > idx) {
          svg.insertBefore(path, svg.childNodes[idx]);
        } else {
          svg.appendChild(path);
        }
      };
      _ju.svg = {
        node: _node,
        attr: _attr,
        pos: _pos
      };
      var SvgComponent = function(params) {
        var pointerEventsSpec = params.pointerEventsSpec || "all", renderer = {};
        _jp.jsPlumbUIComponent.apply(this, params.originalArgs);
        this.canvas = null;
        this.path = null;
        this.svg = null;
        this.bgCanvas = null;
        var clazz = params.cssClass + " " + (params.originalArgs[0].cssClass || ""), svgParams = {
          "style": "",
          "width": 0,
          "height": 0,
          "pointer-events": pointerEventsSpec,
          "position": "absolute"
        };
        this.svg = _node("svg", svgParams);
        if (params.useDivWrapper) {
          this.canvas = _jp.createElement("div", { position: "absolute" });
          _ju.sizeElement(this.canvas, 0, 0, 1, 1);
          this.canvas.className = clazz;
        } else {
          _attr(this.svg, { "class": clazz });
          this.canvas = this.svg;
        }
        params._jsPlumb.appendElement(this.canvas, params.originalArgs[0].parent);
        if (params.useDivWrapper) {
          this.canvas.appendChild(this.svg);
        }
        var displayElements = [this.canvas];
        this.getDisplayElements = function() {
          return displayElements;
        };
        this.appendDisplayElement = function(el) {
          displayElements.push(el);
        };
        this.paint = function(style, anchor, extents) {
          if (style != null) {
            var xy = [this.x, this.y], wh = [this.w, this.h], p;
            if (extents != null) {
              if (extents.xmin < 0) {
                xy[0] += extents.xmin;
              }
              if (extents.ymin < 0) {
                xy[1] += extents.ymin;
              }
              wh[0] = extents.xmax + (extents.xmin < 0 ? -extents.xmin : 0);
              wh[1] = extents.ymax + (extents.ymin < 0 ? -extents.ymin : 0);
            }
            if (params.useDivWrapper) {
              _ju.sizeElement(this.canvas, xy[0], xy[1], wh[0] > 0 ? wh[0] : 1, wh[1] > 0 ? wh[1] : 1);
              xy[0] = 0;
              xy[1] = 0;
              p = _pos([0, 0]);
            } else {
              p = _pos([xy[0], xy[1]]);
            }
            renderer.paint.apply(this, arguments);
            _attr(this.svg, {
              "style": p,
              "width": wh[0] || 1,
              "height": wh[1] || 1
            });
          }
        };
        return {
          renderer
        };
      };
      _ju.extend(SvgComponent, _jp.jsPlumbUIComponent, {
        cleanup: function(force) {
          if (force || this.typeId == null) {
            if (this.canvas) {
              this.canvas._jsPlumb = null;
            }
            if (this.svg) {
              this.svg._jsPlumb = null;
            }
            if (this.bgCanvas) {
              this.bgCanvas._jsPlumb = null;
            }
            if (this.canvas && this.canvas.parentNode) {
              this.canvas.parentNode.removeChild(this.canvas);
            }
            if (this.bgCanvas && this.bgCanvas.parentNode) {
              this.canvas.parentNode.removeChild(this.canvas);
            }
            this.svg = null;
            this.canvas = null;
            this.path = null;
            this.group = null;
            this._jsPlumb = null;
          } else {
            if (this.canvas && this.canvas.parentNode) {
              this.canvas.parentNode.removeChild(this.canvas);
            }
            if (this.bgCanvas && this.bgCanvas.parentNode) {
              this.bgCanvas.parentNode.removeChild(this.bgCanvas);
            }
          }
        },
        reattach: function(instance) {
          var c = instance.getContainer();
          if (this.canvas && this.canvas.parentNode == null) {
            c.appendChild(this.canvas);
          }
          if (this.bgCanvas && this.bgCanvas.parentNode == null) {
            c.appendChild(this.bgCanvas);
          }
        },
        setVisible: function(v) {
          if (this.canvas) {
            this.canvas.style.display = v ? "block" : "none";
          }
        }
      });
      _jp.ConnectorRenderers.svg = function(params) {
        var self = this, _super = SvgComponent.apply(this, [
          {
            cssClass: params._jsPlumb.connectorClass,
            originalArgs: arguments,
            pointerEventsSpec: "none",
            _jsPlumb: params._jsPlumb
          }
        ]);
        _super.renderer.paint = function(style, anchor, extents) {
          var segments = self.getSegments(), p = "", offset = [0, 0];
          if (extents.xmin < 0) {
            offset[0] = -extents.xmin;
          }
          if (extents.ymin < 0) {
            offset[1] = -extents.ymin;
          }
          if (segments.length > 0) {
            p = self.getPathData();
            var a = {
              d: p,
              transform: "translate(" + offset[0] + "," + offset[1] + ")",
              "pointer-events": params["pointer-events"] || "visibleStroke"
            }, outlineStyle = null, d = [self.x, self.y, self.w, self.h];
            if (style.outlineStroke) {
              var outlineWidth = style.outlineWidth || 1, outlineStrokeWidth = style.strokeWidth + 2 * outlineWidth;
              outlineStyle = _jp.extend({}, style);
              delete outlineStyle.gradient;
              outlineStyle.stroke = style.outlineStroke;
              outlineStyle.strokeWidth = outlineStrokeWidth;
              if (self.bgPath == null) {
                self.bgPath = _node("path", a);
                _jp.addClass(self.bgPath, _jp.connectorOutlineClass);
                _appendAtIndex(self.svg, self.bgPath, 0);
              } else {
                _attr(self.bgPath, a);
              }
              _applyStyles(self.svg, self.bgPath, outlineStyle, d, self);
            }
            if (self.path == null) {
              self.path = _node("path", a);
              _appendAtIndex(self.svg, self.path, style.outlineStroke ? 1 : 0);
            } else {
              _attr(self.path, a);
            }
            _applyStyles(self.svg, self.path, style, d, self);
          }
        };
      };
      _ju.extend(_jp.ConnectorRenderers.svg, SvgComponent);
      var SvgEndpoint = _jp.SvgEndpoint = function(params) {
        var _super = SvgComponent.apply(this, [
          {
            cssClass: params._jsPlumb.endpointClass,
            originalArgs: arguments,
            pointerEventsSpec: "all",
            useDivWrapper: true,
            _jsPlumb: params._jsPlumb
          }
        ]);
        _super.renderer.paint = (function(style) {
          var s = _jp.extend({}, style);
          if (s.outlineStroke) {
            s.stroke = s.outlineStroke;
          }
          if (this.node == null) {
            this.node = this.makeNode(s);
            this.svg.appendChild(this.node);
          } else if (this.updateNode != null) {
            this.updateNode(this.node);
          }
          _applyStyles(this.svg, this.node, s, [this.x, this.y, this.w, this.h], this);
          _pos(this.node, [this.x, this.y]);
        }).bind(this);
      };
      _ju.extend(SvgEndpoint, SvgComponent);
      _jp.Endpoints.svg.Dot = function() {
        _jp.Endpoints.Dot.apply(this, arguments);
        SvgEndpoint.apply(this, arguments);
        this.makeNode = function(style) {
          return _node("circle", {
            "cx": this.w / 2,
            "cy": this.h / 2,
            "r": this.radius
          });
        };
        this.updateNode = function(node) {
          _attr(node, {
            "cx": this.w / 2,
            "cy": this.h / 2,
            "r": this.radius
          });
        };
      };
      _ju.extend(_jp.Endpoints.svg.Dot, [_jp.Endpoints.Dot, SvgEndpoint]);
      _jp.Endpoints.svg.Rectangle = function() {
        _jp.Endpoints.Rectangle.apply(this, arguments);
        SvgEndpoint.apply(this, arguments);
        this.makeNode = function(style) {
          return _node("rect", {
            "width": this.w,
            "height": this.h
          });
        };
        this.updateNode = function(node) {
          _attr(node, {
            "width": this.w,
            "height": this.h
          });
        };
      };
      _ju.extend(_jp.Endpoints.svg.Rectangle, [_jp.Endpoints.Rectangle, SvgEndpoint]);
      _jp.Endpoints.svg.Image = _jp.Endpoints.Image;
      _jp.Endpoints.svg.Blank = _jp.Endpoints.Blank;
      _jp.Overlays.svg.Label = _jp.Overlays.Label;
      _jp.Overlays.svg.Custom = _jp.Overlays.Custom;
      var AbstractSvgArrowOverlay = function(superclass, originalArgs) {
        superclass.apply(this, originalArgs);
        _jp.jsPlumbUIComponent.apply(this, originalArgs);
        this.isAppendedAtTopLevel = false;
        this.path = null;
        this.paint = function(params, containerExtents) {
          if (params.component.svg && containerExtents) {
            if (this.path == null) {
              this.path = _node("path", {
                "pointer-events": "all"
              });
              params.component.svg.appendChild(this.path);
              if (this.elementCreated) {
                this.elementCreated(this.path, params.component);
              }
              this.canvas = params.component.svg;
            }
            var clazz = originalArgs && originalArgs.length === 1 ? originalArgs[0].cssClass || "" : "", offset = [0, 0];
            if (containerExtents.xmin < 0) {
              offset[0] = -containerExtents.xmin;
            }
            if (containerExtents.ymin < 0) {
              offset[1] = -containerExtents.ymin;
            }
            _attr(this.path, {
              "d": makePath(params.d),
              "class": clazz,
              stroke: params.stroke ? params.stroke : null,
              fill: params.fill ? params.fill : null,
              transform: "translate(" + offset[0] + "," + offset[1] + ")"
            });
          }
        };
        var makePath = function(d) {
          return isNaN(d.cxy.x) || isNaN(d.cxy.y) ? "" : "M" + d.hxy.x + "," + d.hxy.y + " L" + d.tail[0].x + "," + d.tail[0].y + " L" + d.cxy.x + "," + d.cxy.y + " L" + d.tail[1].x + "," + d.tail[1].y + " L" + d.hxy.x + "," + d.hxy.y;
        };
        this.transfer = function(target) {
          if (target.canvas && this.path && this.path.parentNode) {
            this.path.parentNode.removeChild(this.path);
            target.canvas.appendChild(this.path);
          }
        };
      };
      var svgProtoFunctions = {
        cleanup: function(force) {
          if (this.path != null) {
            if (force) {
              this._jsPlumb.instance.removeElement(this.path);
            } else {
              if (this.path.parentNode) {
                this.path.parentNode.removeChild(this.path);
              }
            }
          }
        },
        reattach: function(instance, component) {
          if (this.path && component.canvas) {
            component.canvas.appendChild(this.path);
          }
        },
        setVisible: function(v) {
          if (this.path != null) {
            this.path.style.display = v ? "block" : "none";
          }
        }
      };
      _ju.extend(AbstractSvgArrowOverlay, [_jp.jsPlumbUIComponent, _jp.Overlays.AbstractOverlay]);
      _jp.Overlays.svg.Arrow = function() {
        AbstractSvgArrowOverlay.apply(this, [_jp.Overlays.Arrow, arguments]);
      };
      _ju.extend(_jp.Overlays.svg.Arrow, [_jp.Overlays.Arrow, AbstractSvgArrowOverlay], svgProtoFunctions);
      _jp.Overlays.svg.PlainArrow = function() {
        AbstractSvgArrowOverlay.apply(this, [_jp.Overlays.PlainArrow, arguments]);
      };
      _ju.extend(_jp.Overlays.svg.PlainArrow, [_jp.Overlays.PlainArrow, AbstractSvgArrowOverlay], svgProtoFunctions);
      _jp.Overlays.svg.Diamond = function() {
        AbstractSvgArrowOverlay.apply(this, [_jp.Overlays.Diamond, arguments]);
      };
      _ju.extend(_jp.Overlays.svg.Diamond, [_jp.Overlays.Diamond, AbstractSvgArrowOverlay], svgProtoFunctions);
      _jp.Overlays.svg.GuideLines = function() {
        var path = null, self = this, p1_1, p1_2;
        _jp.Overlays.GuideLines.apply(this, arguments);
        this.paint = function(params, containerExtents) {
          if (path == null) {
            path = _node("path");
            params.connector.svg.appendChild(path);
            self.attachListeners(path, params.connector);
            self.attachListeners(path, self);
            p1_1 = _node("path");
            params.connector.svg.appendChild(p1_1);
            self.attachListeners(p1_1, params.connector);
            self.attachListeners(p1_1, self);
            p1_2 = _node("path");
            params.connector.svg.appendChild(p1_2);
            self.attachListeners(p1_2, params.connector);
            self.attachListeners(p1_2, self);
          }
          var offset = [0, 0];
          if (containerExtents.xmin < 0) {
            offset[0] = -containerExtents.xmin;
          }
          if (containerExtents.ymin < 0) {
            offset[1] = -containerExtents.ymin;
          }
          _attr(path, {
            "d": makePath(params.head, params.tail),
            stroke: "red",
            fill: null,
            transform: "translate(" + offset[0] + "," + offset[1] + ")"
          });
          _attr(p1_1, {
            "d": makePath(params.tailLine[0], params.tailLine[1]),
            stroke: "blue",
            fill: null,
            transform: "translate(" + offset[0] + "," + offset[1] + ")"
          });
          _attr(p1_2, {
            "d": makePath(params.headLine[0], params.headLine[1]),
            stroke: "green",
            fill: null,
            transform: "translate(" + offset[0] + "," + offset[1] + ")"
          });
        };
        var makePath = function(d1, d2) {
          return "M " + d1.x + "," + d1.y + " L" + d2.x + "," + d2.y;
        };
      };
      _ju.extend(_jp.Overlays.svg.GuideLines, _jp.Overlays.GuideLines);
    }).call(typeof window !== "undefined" ? window : jsplumb);
    (function() {
      var root = this, _jp = root.jsPlumb, _ju = root.jsPlumbUtil, _jk = root.Katavorio, _jg = root.Biltong;
      var _getEventManager = function(instance) {
        var e = instance._mottle;
        if (!e) {
          e = instance._mottle = new root.Mottle();
        }
        return e;
      };
      var _getDragManager = function(instance, category) {
        category = category || "main";
        var key = "_katavorio_" + category;
        var k = instance[key], e = instance.getEventManager();
        if (!k) {
          k = new _jk({
            bind: e.on,
            unbind: e.off,
            getSize: _jp.getSize,
            getConstrainingRectangle: function(el) {
              return [el.parentNode.scrollWidth, el.parentNode.scrollHeight];
            },
            getPosition: function(el, relativeToRoot) {
              var o = instance.getOffset(el, relativeToRoot, el._katavorioDrag ? el.offsetParent : null);
              return [o.left, o.top];
            },
            setPosition: function(el, xy) {
              el.style.left = xy[0] + "px";
              el.style.top = xy[1] + "px";
            },
            addClass: _jp.addClass,
            removeClass: _jp.removeClass,
            intersects: _jg.intersects,
            indexOf: function(l, i) {
              return l.indexOf(i);
            },
            scope: instance.getDefaultScope(),
            css: {
              noSelect: instance.dragSelectClass,
              droppable: "jtk-droppable",
              draggable: "jtk-draggable",
              drag: "jtk-drag",
              selected: "jtk-drag-selected",
              active: "jtk-drag-active",
              hover: "jtk-drag-hover",
              ghostProxy: "jtk-ghost-proxy"
            }
          });
          k.setZoom(instance.getZoom());
          instance[key] = k;
          instance.bind("zoom", k.setZoom);
        }
        return k;
      };
      var _dragStart = function(params) {
        var options = params.el._jsPlumbDragOptions;
        var cont = true;
        if (options.canDrag) {
          cont = options.canDrag();
        }
        if (cont) {
          this.setHoverSuspended(true);
          this.select({ source: params.el }).addClass(this.elementDraggingClass + " " + this.sourceElementDraggingClass, true);
          this.select({ target: params.el }).addClass(this.elementDraggingClass + " " + this.targetElementDraggingClass, true);
          this.setConnectionBeingDragged(true);
        }
        return cont;
      };
      var _dragMove = function(params) {
        var ui = this.getUIPosition(arguments, this.getZoom());
        if (ui != null) {
          var o = params.el._jsPlumbDragOptions;
          this.draw(params.el, ui, null, true);
          if (o._dragging) {
            this.addClass(params.el, "jtk-dragged");
          }
          o._dragging = true;
        }
      };
      var _dragStop = function(params) {
        var elements = params.selection, uip;
        var _one = (function(_e) {
          var drawResult;
          if (_e[1] != null) {
            uip = this.getUIPosition([{
              el: _e[2].el,
              pos: [_e[1].left, _e[1].top]
            }]);
            drawResult = this.draw(_e[2].el, uip);
          }
          if (_e[0]._jsPlumbDragOptions != null) {
            delete _e[0]._jsPlumbDragOptions._dragging;
          }
          this.removeClass(_e[0], "jtk-dragged");
          this.select({ source: _e[2].el }).removeClass(this.elementDraggingClass + " " + this.sourceElementDraggingClass, true);
          this.select({ target: _e[2].el }).removeClass(this.elementDraggingClass + " " + this.targetElementDraggingClass, true);
          params.e._drawResult = params.e._drawResult || { c: [], e: [], a: [] };
          Array.prototype.push.apply(params.e._drawResult.c, drawResult.c);
          Array.prototype.push.apply(params.e._drawResult.e, drawResult.e);
          Array.prototype.push.apply(params.e._drawResult.a, drawResult.a);
          this.getDragManager().dragEnded(_e[2].el);
        }).bind(this);
        for (var i = 0; i < elements.length; i++) {
          _one(elements[i]);
        }
        this.setHoverSuspended(false);
        this.setConnectionBeingDragged(false);
      };
      var _animProps = function(o, p) {
        var _one = function(pName) {
          if (p[pName] != null) {
            if (_ju.isString(p[pName])) {
              var m = p[pName].match(/-=/) ? -1 : 1, v = p[pName].substring(2);
              return o[pName] + m * v;
            } else {
              return p[pName];
            }
          } else {
            return o[pName];
          }
        };
        return [_one("left"), _one("top")];
      };
      var _genLoc = function(prefix, e) {
        if (e == null) {
          return [0, 0];
        }
        var ts = _touches(e), t = _getTouch(ts, 0);
        return [t[prefix + "X"], t[prefix + "Y"]];
      }, _pageLocation = _genLoc.bind(this, "page"), _screenLocation = _genLoc.bind(this, "screen"), _clientLocation = _genLoc.bind(this, "client"), _getTouch = function(touches, idx) {
        return touches.item ? touches.item(idx) : touches[idx];
      }, _touches = function(e) {
        return e.touches && e.touches.length > 0 ? e.touches : e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches : e.targetTouches && e.targetTouches.length > 0 ? e.targetTouches : [e];
      };
      var DragManager = function(_currentInstance) {
        var _draggables = {}, _dlist = [], _delements = {}, _elementsWithEndpoints = {}, _draggablesForElements = {};
        this.register = function(el) {
          var id = _currentInstance.getId(el), parentOffset;
          if (!_draggables[id]) {
            _draggables[id] = el;
            _dlist.push(el);
            _delements[id] = {};
          }
          var _oneLevel = function(p) {
            if (p) {
              for (var i = 0; i < p.childNodes.length; i++) {
                if (p.childNodes[i].nodeType !== 3 && p.childNodes[i].nodeType !== 8) {
                  var cEl = jsPlumb.getElement(p.childNodes[i]), cid = _currentInstance.getId(p.childNodes[i], null, true);
                  if (cid && _elementsWithEndpoints[cid] && _elementsWithEndpoints[cid] > 0) {
                    if (!parentOffset) {
                      parentOffset = _currentInstance.getOffset(el);
                    }
                    var cOff = _currentInstance.getOffset(cEl);
                    _delements[id][cid] = {
                      id: cid,
                      offset: {
                        left: cOff.left - parentOffset.left,
                        top: cOff.top - parentOffset.top
                      }
                    };
                    _draggablesForElements[cid] = id;
                  }
                  _oneLevel(p.childNodes[i]);
                }
              }
            }
          };
          _oneLevel(el);
        };
        this.updateOffsets = function(elId, childOffsetOverrides) {
          if (elId != null) {
            childOffsetOverrides = childOffsetOverrides || {};
            var domEl = jsPlumb.getElement(elId), id = _currentInstance.getId(domEl), children = _delements[id], parentOffset;
            if (children) {
              for (var i in children) {
                if (children.hasOwnProperty(i)) {
                  var cel = jsPlumb.getElement(i), cOff = childOffsetOverrides[i] || _currentInstance.getOffset(cel);
                  if (cel.offsetParent == null && _delements[id][i] != null) {
                    continue;
                  }
                  if (!parentOffset) {
                    parentOffset = _currentInstance.getOffset(domEl);
                  }
                  _delements[id][i] = {
                    id: i,
                    offset: {
                      left: cOff.left - parentOffset.left,
                      top: cOff.top - parentOffset.top
                    }
                  };
                  _draggablesForElements[i] = id;
                }
              }
            }
          }
        };
        this.endpointAdded = function(el, id) {
          id = id || _currentInstance.getId(el);
          var b = document.body, p = el.parentNode;
          _elementsWithEndpoints[id] = _elementsWithEndpoints[id] ? _elementsWithEndpoints[id] + 1 : 1;
          while (p != null && p !== b) {
            var pid = _currentInstance.getId(p, null, true);
            if (pid && _draggables[pid]) {
              var pLoc = _currentInstance.getOffset(p);
              if (_delements[pid][id] == null) {
                var cLoc = _currentInstance.getOffset(el);
                _delements[pid][id] = {
                  id,
                  offset: {
                    left: cLoc.left - pLoc.left,
                    top: cLoc.top - pLoc.top
                  }
                };
                _draggablesForElements[id] = pid;
              }
              break;
            }
            p = p.parentNode;
          }
        };
        this.endpointDeleted = function(endpoint) {
          if (_elementsWithEndpoints[endpoint.elementId]) {
            _elementsWithEndpoints[endpoint.elementId]--;
            if (_elementsWithEndpoints[endpoint.elementId] <= 0) {
              for (var i in _delements) {
                if (_delements.hasOwnProperty(i) && _delements[i]) {
                  delete _delements[i][endpoint.elementId];
                  delete _draggablesForElements[endpoint.elementId];
                }
              }
            }
          }
        };
        this.changeId = function(oldId, newId) {
          _delements[newId] = _delements[oldId];
          _delements[oldId] = {};
          _draggablesForElements[newId] = _draggablesForElements[oldId];
          _draggablesForElements[oldId] = null;
        };
        this.getElementsForDraggable = function(id) {
          return _delements[id];
        };
        this.elementRemoved = function(elementId) {
          var elId = _draggablesForElements[elementId];
          if (elId) {
            _delements[elId] && delete _delements[elId][elementId];
            delete _draggablesForElements[elementId];
          }
        };
        this.reset = function() {
          _draggables = {};
          _dlist = [];
          _delements = {};
          _elementsWithEndpoints = {};
        };
        this.dragEnded = function(el) {
          if (el.offsetParent != null) {
            var id = _currentInstance.getId(el), ancestor = _draggablesForElements[id];
            if (ancestor) {
              this.updateOffsets(ancestor);
            }
          }
        };
        this.setParent = function(el, elId, p, pId, currentChildLocation) {
          var current = _draggablesForElements[elId];
          if (!_delements[pId]) {
            _delements[pId] = {};
          }
          var pLoc = _currentInstance.getOffset(p), cLoc = currentChildLocation || _currentInstance.getOffset(el);
          if (current && _delements[current]) {
            delete _delements[current][elId];
          }
          _delements[pId][elId] = {
            id: elId,
            offset: {
              left: cLoc.left - pLoc.left,
              top: cLoc.top - pLoc.top
            }
          };
          _draggablesForElements[elId] = pId;
        };
        this.clearParent = function(el, elId) {
          var current = _draggablesForElements[elId];
          if (current) {
            delete _delements[current][elId];
            delete _draggablesForElements[elId];
          }
        };
        this.revalidateParent = function(el, elId, childOffset) {
          var current = _draggablesForElements[elId];
          if (current) {
            var co = {};
            co[elId] = childOffset;
            this.updateOffsets(current, co);
            _currentInstance.revalidate(current);
          }
        };
        this.getDragAncestor = function(el) {
          var de = jsPlumb.getElement(el), id = _currentInstance.getId(de), aid = _draggablesForElements[id];
          if (aid) {
            return jsPlumb.getElement(aid);
          } else {
            return null;
          }
        };
      };
      var _setClassName = function(el, cn, classList) {
        cn = _ju.fastTrim(cn);
        if (typeof el.className.baseVal !== "undefined") {
          el.className.baseVal = cn;
        } else {
          el.className = cn;
        }
        try {
          var cl = el.classList;
          if (cl != null) {
            while (cl.length > 0) {
              cl.remove(cl.item(0));
            }
            for (var i = 0; i < classList.length; i++) {
              if (classList[i]) {
                cl.add(classList[i]);
              }
            }
          }
        } catch (e) {
          _ju.log("JSPLUMB: cannot set class list", e);
        }
      }, _getClassName = function(el) {
        return typeof el.className.baseVal === "undefined" ? el.className : el.className.baseVal;
      }, _classManip = function(el, classesToAdd, classesToRemove) {
        classesToAdd = classesToAdd == null ? [] : _ju.isArray(classesToAdd) ? classesToAdd : classesToAdd.split(/\s+/);
        classesToRemove = classesToRemove == null ? [] : _ju.isArray(classesToRemove) ? classesToRemove : classesToRemove.split(/\s+/);
        var className = _getClassName(el), curClasses = className.split(/\s+/);
        var _oneSet = function(add, classes) {
          for (var i = 0; i < classes.length; i++) {
            if (add) {
              if (curClasses.indexOf(classes[i]) === -1) {
                curClasses.push(classes[i]);
              }
            } else {
              var idx = curClasses.indexOf(classes[i]);
              if (idx !== -1) {
                curClasses.splice(idx, 1);
              }
            }
          }
        };
        _oneSet(true, classesToAdd);
        _oneSet(false, classesToRemove);
        _setClassName(el, curClasses.join(" "), curClasses);
      };
      root.jsPlumb.extend(root.jsPlumbInstance.prototype, {
        headless: false,
        pageLocation: _pageLocation,
        screenLocation: _screenLocation,
        clientLocation: _clientLocation,
        getDragManager: function() {
          if (this.dragManager == null) {
            this.dragManager = new DragManager(this);
          }
          return this.dragManager;
        },
        recalculateOffsets: function(elId) {
          this.getDragManager().updateOffsets(elId);
        },
        createElement: function(tag, style, clazz, atts) {
          return this.createElementNS(null, tag, style, clazz, atts);
        },
        createElementNS: function(ns, tag, style, clazz, atts) {
          var e = ns == null ? document.createElement(tag) : document.createElementNS(ns, tag);
          var i;
          style = style || {};
          for (i in style) {
            e.style[i] = style[i];
          }
          if (clazz) {
            e.className = clazz;
          }
          atts = atts || {};
          for (i in atts) {
            e.setAttribute(i, "" + atts[i]);
          }
          return e;
        },
        getAttribute: function(el, attName) {
          return el.getAttribute != null ? el.getAttribute(attName) : null;
        },
        setAttribute: function(el, a, v) {
          if (el.setAttribute != null) {
            el.setAttribute(a, v);
          }
        },
        setAttributes: function(el, atts) {
          for (var i in atts) {
            if (atts.hasOwnProperty(i)) {
              el.setAttribute(i, atts[i]);
            }
          }
        },
        appendToRoot: function(node) {
          document.body.appendChild(node);
        },
        getRenderModes: function() {
          return ["svg"];
        },
        getClass: _getClassName,
        addClass: function(el, clazz) {
          jsPlumb.each(el, function(e) {
            _classManip(e, clazz);
          });
        },
        hasClass: function(el, clazz) {
          el = jsPlumb.getElement(el);
          if (el.classList) {
            return el.classList.contains(clazz);
          } else {
            return _getClassName(el).indexOf(clazz) !== -1;
          }
        },
        removeClass: function(el, clazz) {
          jsPlumb.each(el, function(e) {
            _classManip(e, null, clazz);
          });
        },
        toggleClass: function(el, clazz) {
          if (jsPlumb.hasClass(el, clazz)) {
            jsPlumb.removeClass(el, clazz);
          } else {
            jsPlumb.addClass(el, clazz);
          }
        },
        updateClasses: function(el, toAdd, toRemove) {
          jsPlumb.each(el, function(e) {
            _classManip(e, toAdd, toRemove);
          });
        },
        setClass: function(el, clazz) {
          if (clazz != null) {
            jsPlumb.each(el, function(e) {
              _setClassName(e, clazz, clazz.split(/\s+/));
            });
          }
        },
        setPosition: function(el, p) {
          el.style.left = p.left + "px";
          el.style.top = p.top + "px";
        },
        getPosition: function(el) {
          var _one = function(prop) {
            var v = el.style[prop];
            return v ? v.substring(0, v.length - 2) : 0;
          };
          return {
            left: _one("left"),
            top: _one("top")
          };
        },
        getStyle: function(el, prop) {
          if (typeof window.getComputedStyle !== "undefined") {
            return getComputedStyle(el, null).getPropertyValue(prop);
          } else {
            return el.currentStyle[prop];
          }
        },
        getSelector: function(ctx, spec) {
          var sel = null;
          if (arguments.length === 1) {
            sel = ctx.nodeType != null ? ctx : document.querySelectorAll(ctx);
          } else {
            sel = ctx.querySelectorAll(spec);
          }
          return sel;
        },
        getOffset: function(el, relativeToRoot, container) {
          el = jsPlumb.getElement(el);
          container = container || this.getContainer();
          var out = {
            left: el.offsetLeft,
            top: el.offsetTop
          }, op = relativeToRoot || container != null && (el !== container && el.offsetParent !== container) ? el.offsetParent : null, _maybeAdjustScroll = (function(offsetParent) {
            if (offsetParent != null && offsetParent !== document.body && (offsetParent.scrollTop > 0 || offsetParent.scrollLeft > 0)) {
              out.left -= offsetParent.scrollLeft;
              out.top -= offsetParent.scrollTop;
            }
          }).bind(this);
          while (op != null) {
            out.left += op.offsetLeft;
            out.top += op.offsetTop;
            _maybeAdjustScroll(op);
            op = relativeToRoot ? op.offsetParent : op.offsetParent === container ? null : op.offsetParent;
          }
          if (container != null && !relativeToRoot && (container.scrollTop > 0 || container.scrollLeft > 0)) {
            var pp = el.offsetParent != null ? this.getStyle(el.offsetParent, "position") : "static", p = this.getStyle(el, "position");
            if (p !== "absolute" && p !== "fixed" && pp !== "absolute" && pp !== "fixed") {
              out.left -= container.scrollLeft;
              out.top -= container.scrollTop;
            }
          }
          return out;
        },
        //
        // return x+y proportion of the given element's size corresponding to the location of the given event.
        //
        getPositionOnElement: function(evt, el, zoom) {
          var box = typeof el.getBoundingClientRect !== "undefined" ? el.getBoundingClientRect() : { left: 0, top: 0, width: 0, height: 0 }, body = document.body, docElem = document.documentElement, scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop, scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft, clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0, pst = 0, psl = 0, top = box.top + scrollTop - clientTop + pst * zoom, left = box.left + scrollLeft - clientLeft + psl * zoom, cl = jsPlumb.pageLocation(evt), w = box.width || el.offsetWidth * zoom, h = box.height || el.offsetHeight * zoom, x = (cl[0] - left) / w, y = (cl[1] - top) / h;
          return [x, y];
        },
        /**
         * Gets the absolute position of some element as read from the left/top properties in its style.
         * @method getAbsolutePosition
         * @param {Element} el The element to retrieve the absolute coordinates from. **Note** this is a DOM element, not a selector from the underlying library.
         * @return {Number[]} [left, top] pixel values.
         */
        getAbsolutePosition: function(el) {
          var _one = function(s) {
            var ss = el.style[s];
            if (ss) {
              return parseFloat(ss.substring(0, ss.length - 2));
            }
          };
          return [_one("left"), _one("top")];
        },
        /**
         * Sets the absolute position of some element by setting the left/top properties in its style.
         * @method setAbsolutePosition
         * @param {Element} el The element to set the absolute coordinates on. **Note** this is a DOM element, not a selector from the underlying library.
         * @param {Number[]} xy x and y coordinates
         * @param {Number[]} [animateFrom] Optional previous xy to animate from.
         * @param {Object} [animateOptions] Options for the animation.
         */
        setAbsolutePosition: function(el, xy, animateFrom, animateOptions) {
          if (animateFrom) {
            this.animate(el, {
              left: "+=" + (xy[0] - animateFrom[0]),
              top: "+=" + (xy[1] - animateFrom[1])
            }, animateOptions);
          } else {
            el.style.left = xy[0] + "px";
            el.style.top = xy[1] + "px";
          }
        },
        /**
         * gets the size for the element, in an array : [ width, height ].
         */
        getSize: function(el) {
          return [el.offsetWidth, el.offsetHeight];
        },
        getWidth: function(el) {
          return el.offsetWidth;
        },
        getHeight: function(el) {
          return el.offsetHeight;
        },
        getRenderMode: function() {
          return "svg";
        },
        draggable: function(el, options) {
          var info;
          el = _ju.isArray(el) || el.length != null && !_ju.isString(el) ? el : [el];
          Array.prototype.slice.call(el).forEach((function(_el) {
            info = this.info(_el);
            if (info.el) {
              this._initDraggableIfNecessary(info.el, true, options, info.id, true);
            }
          }).bind(this));
          return this;
        },
        snapToGrid: function(el, x, y) {
          var out = [];
          var _oneEl = (function(_el) {
            var info = this.info(_el);
            if (info.el != null && info.el._katavorioDrag) {
              var snapped = info.el._katavorioDrag.snap(x, y);
              this.revalidate(info.el);
              out.push([info.el, snapped]);
            }
          }).bind(this);
          if (arguments.length === 1 || arguments.length === 3) {
            _oneEl(el, x, y);
          } else {
            var _me = this.getManagedElements();
            for (var mel in _me) {
              _oneEl(mel, arguments[0], arguments[1]);
            }
          }
          return out;
        },
        initDraggable: function(el, options, category) {
          _getDragManager(this, category).draggable(el, options);
          el._jsPlumbDragOptions = options;
        },
        destroyDraggable: function(el, category) {
          _getDragManager(this, category).destroyDraggable(el);
          el._jsPlumbDragOptions = null;
          el._jsPlumbRelatedElement = null;
        },
        unbindDraggable: function(el, evt, fn, category) {
          _getDragManager(this, category).destroyDraggable(el, evt, fn);
        },
        setDraggable: function(element, draggable) {
          return jsPlumb.each(element, (function(el) {
            if (this.isDragSupported(el)) {
              this._draggableStates[this.getAttribute(el, "id")] = draggable;
              this.setElementDraggable(el, draggable);
            }
          }).bind(this));
        },
        _draggableStates: {},
        /*
         * toggles the draggable state of the given element(s).
         * el is either an id, or an element object, or a list of ids/element objects.
         */
        toggleDraggable: function(el) {
          var state;
          jsPlumb.each(el, (function(el2) {
            var elId = this.getAttribute(el2, "id");
            state = this._draggableStates[elId] == null ? false : this._draggableStates[elId];
            state = !state;
            this._draggableStates[elId] = state;
            this.setDraggable(el2, state);
            return state;
          }).bind(this));
          return state;
        },
        _initDraggableIfNecessary: function(element, isDraggable, dragOptions, id, fireEvent) {
          if (!jsPlumb.headless) {
            var _draggable = isDraggable == null ? false : isDraggable;
            if (_draggable) {
              if (jsPlumb.isDragSupported(element, this)) {
                var options = dragOptions || this.Defaults.DragOptions;
                options = jsPlumb.extend({}, options);
                if (!jsPlumb.isAlreadyDraggable(element, this)) {
                  var dragEvent = jsPlumb.dragEvents.drag, stopEvent = jsPlumb.dragEvents.stop, startEvent = jsPlumb.dragEvents.start;
                  this.manage(id, element);
                  options[startEvent] = _ju.wrap(options[startEvent], _dragStart.bind(this));
                  options[dragEvent] = _ju.wrap(options[dragEvent], _dragMove.bind(this));
                  options[stopEvent] = _ju.wrap(options[stopEvent], _dragStop.bind(this));
                  var elId = this.getId(element);
                  this._draggableStates[elId] = true;
                  var draggable = this._draggableStates[elId];
                  options.disabled = draggable == null ? false : !draggable;
                  this.initDraggable(element, options);
                  this.getDragManager().register(element);
                  if (fireEvent) {
                    this.fire("elementDraggable", { el: element, options });
                  }
                } else {
                  if (dragOptions.force) {
                    this.initDraggable(element, options);
                  }
                }
              }
            }
          }
        },
        animationSupported: true,
        getElement: function(el) {
          if (el == null) {
            return null;
          }
          el = typeof el === "string" ? el : el.tagName == null && el.length != null && el.enctype == null ? el[0] : el;
          return typeof el === "string" ? document.getElementById(el) : el;
        },
        removeElement: function(element) {
          _getDragManager(this).elementRemoved(element);
          this.getEventManager().remove(element);
        },
        //
        // this adapter supports a rudimentary animation function. no easing is supported.  only
        // left/top properties are supported. property delta args are expected to be in the form
        //
        // +=x.xxxx
        //
        // or
        //
        // -=x.xxxx
        //
        doAnimate: function(el, properties, options) {
          options = options || {};
          var o = this.getOffset(el), ap = _animProps(o, properties), ldist = ap[0] - o.left, tdist = ap[1] - o.top, d = options.duration || 250, step = 15, steps = d / step, linc = step / d * ldist, tinc = step / d * tdist, idx = 0, _int = setInterval(function() {
            _jp.setPosition(el, {
              left: o.left + linc * (idx + 1),
              top: o.top + tinc * (idx + 1)
            });
            if (options.step != null) {
              options.step(idx, Math.ceil(steps));
            }
            idx++;
            if (idx >= steps) {
              window.clearInterval(_int);
              if (options.complete != null) {
                options.complete();
              }
            }
          }, step);
        },
        // DRAG/DROP
        destroyDroppable: function(el, category) {
          _getDragManager(this, category).destroyDroppable(el);
        },
        unbindDroppable: function(el, evt, fn, category) {
          _getDragManager(this, category).destroyDroppable(el, evt, fn);
        },
        droppable: function(el, options) {
          el = _ju.isArray(el) || el.length != null && !_ju.isString(el) ? el : [el];
          var info;
          options = options || {};
          options.allowLoopback = false;
          Array.prototype.slice.call(el).forEach((function(_el) {
            info = this.info(_el);
            if (info.el) {
              this.initDroppable(info.el, options);
            }
          }).bind(this));
          return this;
        },
        initDroppable: function(el, options, category) {
          _getDragManager(this, category).droppable(el, options);
        },
        isAlreadyDraggable: function(el) {
          return el._katavorioDrag != null;
        },
        isDragSupported: function(el, options) {
          return true;
        },
        isDropSupported: function(el, options) {
          return true;
        },
        isElementDraggable: function(el) {
          el = _jp.getElement(el);
          return el._katavorioDrag && el._katavorioDrag.isEnabled();
        },
        getDragObject: function(eventArgs) {
          return eventArgs[0].drag.getDragElement();
        },
        getDragScope: function(el) {
          return el._katavorioDrag && el._katavorioDrag.scopes.join(" ") || "";
        },
        getDropEvent: function(args) {
          return args[0].e;
        },
        getUIPosition: function(eventArgs, zoom) {
          var el = eventArgs[0].el;
          if (el.offsetParent == null) {
            return null;
          }
          var finalPos = eventArgs[0].finalPos || eventArgs[0].pos;
          var p = { left: finalPos[0], top: finalPos[1] };
          if (el._katavorioDrag && el.offsetParent !== this.getContainer()) {
            var oc = this.getOffset(el.offsetParent);
            p.left += oc.left;
            p.top += oc.top;
          }
          return p;
        },
        setDragFilter: function(el, filter, _exclude) {
          if (el._katavorioDrag) {
            el._katavorioDrag.setFilter(filter, _exclude);
          }
        },
        setElementDraggable: function(el, draggable) {
          el = _jp.getElement(el);
          if (el._katavorioDrag) {
            el._katavorioDrag.setEnabled(draggable);
          }
        },
        setDragScope: function(el, scope) {
          if (el._katavorioDrag) {
            el._katavorioDrag.k.setDragScope(el, scope);
          }
        },
        setDropScope: function(el, scope) {
          if (el._katavorioDrop && el._katavorioDrop.length > 0) {
            el._katavorioDrop[0].k.setDropScope(el, scope);
          }
        },
        addToPosse: function(el, spec) {
          var specs = Array.prototype.slice.call(arguments, 1);
          var dm = _getDragManager(this);
          _jp.each(el, function(_el) {
            _el = [_jp.getElement(_el)];
            _el.push.apply(_el, specs);
            dm.addToPosse.apply(dm, _el);
          });
        },
        setPosse: function(el, spec) {
          var specs = Array.prototype.slice.call(arguments, 1);
          var dm = _getDragManager(this);
          _jp.each(el, function(_el) {
            _el = [_jp.getElement(_el)];
            _el.push.apply(_el, specs);
            dm.setPosse.apply(dm, _el);
          });
        },
        removeFromPosse: function(el, posseId) {
          var specs = Array.prototype.slice.call(arguments, 1);
          var dm = _getDragManager(this);
          _jp.each(el, function(_el) {
            _el = [_jp.getElement(_el)];
            _el.push.apply(_el, specs);
            dm.removeFromPosse.apply(dm, _el);
          });
        },
        removeFromAllPosses: function(el) {
          var dm = _getDragManager(this);
          _jp.each(el, function(_el) {
            dm.removeFromAllPosses(_jp.getElement(_el));
          });
        },
        setPosseState: function(el, posseId, state) {
          var dm = _getDragManager(this);
          _jp.each(el, function(_el) {
            dm.setPosseState(_jp.getElement(_el), posseId, state);
          });
        },
        dragEvents: {
          "start": "start",
          "stop": "stop",
          "drag": "drag",
          "step": "step",
          "over": "over",
          "out": "out",
          "drop": "drop",
          "complete": "complete",
          "beforeStart": "beforeStart"
        },
        animEvents: {
          "step": "step",
          "complete": "complete"
        },
        stopDrag: function(el) {
          if (el._katavorioDrag) {
            el._katavorioDrag.abort();
          }
        },
        addToDragSelection: function(spec) {
          var el = this.getElement(spec);
          if (el != null && (el._isJsPlumbGroup || el._jsPlumbGroup == null)) {
            _getDragManager(this).select(spec);
          }
        },
        removeFromDragSelection: function(spec) {
          _getDragManager(this).deselect(spec);
        },
        getDragSelection: function() {
          return _getDragManager(this).getSelection();
        },
        clearDragSelection: function() {
          _getDragManager(this).deselectAll();
        },
        trigger: function(el, event, originalEvent, payload) {
          this.getEventManager().trigger(el, event, originalEvent, payload);
        },
        doReset: function() {
          for (var key in this) {
            if (key.indexOf("_katavorio_") === 0) {
              this[key].reset();
            }
          }
        },
        getEventManager: function() {
          return _getEventManager(this);
        },
        on: function(el, event, callback) {
          this.getEventManager().on.apply(this, arguments);
          return this;
        },
        off: function(el, event, callback) {
          this.getEventManager().off.apply(this, arguments);
          return this;
        }
      });
      var ready = function(f) {
        var _do = function() {
          if (/complete|loaded|interactive/.test(document.readyState) && typeof document.body !== "undefined" && document.body != null) {
            f();
          } else {
            setTimeout(_do, 9);
          }
        };
        _do();
      };
      ready(_jp.init);
    }).call(typeof window !== "undefined" ? window : jsplumb);
  })(jsplumb);
  return jsplumb;
}
var jsplumbExports = requireJsplumb();
export {
  jsplumbExports as j
};
