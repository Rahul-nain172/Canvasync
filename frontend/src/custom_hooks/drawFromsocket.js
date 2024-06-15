import socket from "../../config/socket";
import { useSelector, useDispatch } from "react-redux";
import { addMoveToUser, removeMoveFromUser } from "../redux/room/roomSlice"
import { useEffect } from "react";

export const drawFromSocket = (isDrawing) => {
    const room = useSelector((state) => state.room);
    const dispatch = useDispatch();

    useEffect(() => {
        let toDrawLater = null, userIdLater = "";
        socket.on("user_draw", (move, userId) => {
            if (!isDrawing) {
                dispatch(addMoveToUser({userId, move}));
            } else {
                toDrawLater = move;
                userIdLater = userId;
            }
        });
        return () => {
            socket.off("user_draw");
            if (toDrawLater && userIdLater) {
                dispatch(addMoveToUser({userIdLater, toDrawLater}));
            }
        }
    },[isDrawing,dispatch]);

    useEffect(() => {
        socket.on("user_undo", (userId) => {
          dispatch(removeMoveFromUser(userId));
        });
    
        return () => {
          socket.off("user_undo");
        };
      }, [dispatch]);
    
};