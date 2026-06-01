import { Op } from "sequelize";
import Message from "../models/messages.js";
import { serverResponse } from "../services/serverresponse.js";

export const getallmessage = async (req, res) => {
  try {
    const { id } = req.params;
    const allmessages = await Message.findAll({
      where: {
        [Op.or]: [
          {
            senderId: req.user,
            receiverId: id,
          },
          {
            senderId: id,
            receiverId: req.user,
          },
        ],
      },
      order: [["createdAT", "ASC"]],
    });
    if (!allmessages) return serverResponse(res, 404, "no message found");
    return serverResponse(res, 200, allmessages);
  } catch (err) {
    return serverResponse(res, 500, err.message);
  }
};
