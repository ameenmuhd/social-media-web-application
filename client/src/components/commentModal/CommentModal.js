import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Input from '@mui/joy/Input';
import M from "materialize-css";
import { UserContext } from '../../App';
import axios from 'axios';
import { useState } from 'react';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function CommentModal({children,postId}) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);

  const handleOpen = () =>{
      setOpen(true);
      fetchComments(postId._id)
  } 
  const handleClose = () => setOpen(false);

  const { state, dispatch } = React.useContext(UserContext);

const fetchComments = async (commentId) => {
    
      const {data} = await axios.get(`/getcomments/${commentId}`,{
        headers: {
          Authorization: sessionStorage.getItem("jwt"),
        },
      })
      console.log(data);
      setData(data)
}

//   const deleteComment = (postId, commentId) => {
//     fetch(`/deletecomment/${postId}/${commentId}`, {
//       method: "delete",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + sessionStorage.getItem("jwt"),
//       },
//     })
//       .then((res) => res.json())
//       .then((result) => {
//         const newData = data.map((item) => {
//           if (item._id === result._id) {
//             result.postedBy = item.postedBy;
//             return result;
//           } else {
//             return item;
//           }
//         });
//         setData(newData);
//         M.toast({
//           html: "comment deleted successfully",
//           classes: "#00e676 green accent-3",
//         });
//       });
//   };

  return (
    <div>
      <span onClick={handleOpen}>{children}</span>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2"
          sx={{
            height: "40vh",
            overflowY:"scroll"
        }}
          >
          {data.comments.map((record) => {
                        return (
                          <h6 key={record._id}>
                            <span
                              style={{ fontWeight: "500", fontSize: "14px" }}
                            >
                              {record.postedBy.name}
                            </span>{" "}
                            {record.text}{" "}
                            {/* {record.postedBy._id === state._id && (
                              <i
                                className="material-icons"
                                style={{ fontSize: "12px", marginLeft: "5rem" }}
                                onClick={() => {
                                  swal({
                                    title: "Are you sure to delete comment?",
                                    icon: "warning",
                                    buttons: true,
                                    dangerMode: true,
                                  }).then((willDelete) => {
                                    if (willDelete) {
                                      deleteComment(postId._id, record._id);
                                      swal("Your comment has been deleted!", {
                                        icon: "success",
                                      });
                                    }
                                  });
                                }}
                              >
                                delete
                              </i>
                            )} */}
                          </h6>
                        );
                      })}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {/* <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      makeComment(e.target[0].value, item._id);
                    }}
                  >
                    <Input
                      variant="plain"
                      size="sm"
                      placeholder="Add a comment…"
                      sx={{
                        flexGrow: 1,
                        mr: 1,
                        "--Input-focusedThickness": "0px",
                      }}
                    />
                  </form> */}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
