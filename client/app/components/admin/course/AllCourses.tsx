import React, { FC, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Modal } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { useTheme } from "next-themes";
import { FiEdit2 } from "react-icons/fi";
import { format } from "timeago.js";
import { styles } from "@/app/styles/style";
import Link from "next/link";
import Loader from "./../../loader/Loader";
import { useGetAllCoursesQuery } from "@/redux/features/courses/courseApi";

type Props = {};

const AllCourses: FC<Props> = (props) => {
  const { theme } = useTheme();
  console.log(theme, "theme");
  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState("");
  const { isLoading, data, refetch } = useGetAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Course Name", flex: 1 },
    { field: "ratings", headerName: "Ratings", flex: 0.5 },
    { field: "purchased", headerName: "Purchased", flex: 0.5 },
    { field: "created_at", headerName: "Created At", flex: 0.5 },
    {
      field: "edit",
      headerName: "Edit",
      flex: 0.2,
      renderCell: (params: any) => (
        <Button>
          <Link href={`/admin/edit-course/${params.row.id}`}>
            <FiEdit2 className="dark:text-white text-black" size={20} />
          </Link>
        </Button>
      )
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: any) => (
        <Button
          onClick={() => {
            setOpen(!open);
            setCourseId(params.row.id);
          }}
        >
          <AiOutlineDelete className="dark:text-white text-black" size={20} />
        </Button>
      )
    }
  ];

  const rows: any = [];

  data &&
    data.courses.forEach((item: any) => {
      rows.push({
        id: item._id,
        name: item.name,
        ratings: item.ratings,
        purchased: item.purchased,
        created_at: format(item.createdAt)
      });
    });

  const handleDelete = async () => {
    // const id = courseId;
    // await deleteCourse(id);
  };

  return (
    <div className="mt-[120px]">
      {isLoading ? (
        <Loader />
      ) : (
        <Box m="20px">
          <Box
            m="40px 0 0 0"
            height="80vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
                outline: "none",
                fontSize: "15px",
                fontWeight: "500"
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none!important",
                padding: "8px"
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: theme === "dark" ? "#333" : "#f5f5f5"
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor:
                  theme === "dark"
                    ? "#3e4396 !important"
                    : "#A4A9FC !important",
                borderBottom: "none",
                color: theme === "dark" ? "#fff" : "#000"
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold"
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme === "dark" ? "#1F2A40" : "#F2F0F0"
              },
              "& .MuiDataGrid-footerContainer": {
                color: theme === "dark" ? "#fff" : "#000",
                borderTop: "none",
                backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC"
              },
              "& .MuiCheckbox-root": {
                color:
                  theme === "dark" ? `#b7ebde !important` : `#000 !important`
              },
              "& .MuiDataGrid-sortIcon": {
                color: theme === "dark" ? "#fff" : "#000"
              },
              "& .MuiDataGrid-row": {
                color: theme === "dark" ? "#fff" : "#000",
                borderBottom:
                  theme === "dark"
                    ? "1px solid #ffffff30!important"
                    : "1px solid #ccc!important"
              }
            }}
          >
            <DataGrid checkboxSelection rows={rows} columns={columns} />
          </Box>
          {open && (
            <Modal
              open={open}
              onClose={() => setOpen(!open)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                <h1 className={`${styles.title}`}>
                  Are you sure you want to delete this course?
                </h1>
                <div className="flex w-full items-center justify-between mb-6 mt-4">
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#47d097]`}
                    onClick={() => setOpen(!open)}
                  >
                    Cancel
                  </div>
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#d63f3f]`}
                    onClick={handleDelete}
                  >
                    Delete
                  </div>
                </div>
              </Box>
            </Modal>
          )}
        </Box>
      )}
    </div>
  );
};

export default AllCourses;