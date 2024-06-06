const User = require("../models/User");

exports.getUsers = async (req, res) => {
  const limit = 10;
  const page = req.params.page;

  //   const offset = (page - 1) * limit;

  try {
    const users = await User.paginate(
      {},
      {
        limit,
        page,
        sort: {
          _id: -1,
        },
      }
    );

    const { docs, totalPages } = users;

    res.status(200).json({ users: docs, totalPages, limit });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getUsersBySearch = async (req, res) => {
  const limit = 10;
  const page = req.params.page;

  const { query } = req.params;
  const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
  const searchRgx = rgx(query);

  try {
    const users = await User.paginate(
      {
        $or: [
          { firstName: { $regex: searchRgx, $options: "i" } },
          { lastName: { $regex: searchRgx, $options: "i" } },
          // { _id: { $regex: searchRgx, $options: "i" } },
        ],
      },
      {
        limit,
        page,
      }
    );

    const { docs, totalPages } = users;

    res.status(200).json({ users: docs, totalPages, limit });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.userId });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};
