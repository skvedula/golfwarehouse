module.exports = {
  render: function (res, data) {
    res.render('home', data);
  },
  path  : [ '/home/index.jsp', '/home/', '/' ],

  parse : function(req, response, body, $) {
    return {
      home:true
    };
  }
};
