const Address = require("../models/Address");

exports.addAddress = async (req, res) => {
  const newAddress = new Address(req.body);

  try {
    const address = await newAddress.save();
    res.status(201).json(address);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const updatedAddress = await Address.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!updatedAddress) {
      res.status(404).json({ message: "Address not found, update failed" });
    } else {
      res.status(200).json(updatedAddress);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getUserAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      addresstype: "Billing",
      userId: req.params.userId,
    });
    res.status(200).json(address);
  } catch (err) {
    res.status(500).json(err);
  }
};
