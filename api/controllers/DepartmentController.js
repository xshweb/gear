module.exports = {
  index: function (req, res) {
    Department.find(function (error, departments) {
      res.view('index', {departments: departments});
    });
  },
  create: function (req, res) {
    Department.create({
      name: req.param('name'), members: []
    }, function (error, department) {
      res.redirect('/department');
    });
  },
  find: function (req, res) {
    if (req.wantsJSON) {
      Department.findOne(req.param('id'), function (error, department) {
        res.send(department);
      });
    } else {
      res.view('department');
    }
  },
  update: function (req, res) {
    Department.findOne(req.param('id'), function (error, department) {
      department.name = req.body.name;
      department.members = req.body.members;
      department.save(function (error, department) {
        res.send(error);
      });
    });
  },
  destroy: function (req, res) {
    Department.findOne(req.param('id'), function (error, department) {
      department.destroy(function (error) {
        res.send(error);
      })
    });
  }
};
