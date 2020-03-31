// prototype
Array.prototype.remove = function(needle, key) {
    for (let i in this) {
        if (this[i][key] == needle[key]) this.splice(i, 1)
    }
}
Array.prototype.contains = function ( needle, key ) {
  for (let i in this) {
    if (this[i][key] == needle[key]) return true
  }
  return false
}
Array.prototype.sremove = function(key) {
    for (let i in this) {
        if (this[i] == key) this.splice(i, 1)
    }
}
Array.prototype.scontains = function ( key ) {
  for (let i in this) {
    if (this[i] == key) return true
  }
  return false
}
Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
                date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}