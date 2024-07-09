import "./App.css";
import {
  Box,
  Container,
  Heading,
  Select,
  Table,
  TabNav,
  TextField,
  Theme,
  Text,
  Button,
} from "@radix-ui/themes";
import { Flex } from "@radix-ui/themes";
import axios from "axios";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import AddUserDialog from "./FormComponent/AddUser";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import "../src/FormComponent/styles.css";
import FormUser from "./FormComponent/AddUser";
import EditUserForm from "./FormComponent/EditUser";

function App() {
  const [user, setUser] = useState([]);

  const getUser = async () => {
    const res = await axios.get(
      `https://668a5d512c68eaf3211c9a65.mockapi.io/api/User`
    );
    setUser(res.data);
    console.log(res);
  };
  const [filteredUsers, setFilteredUsers] = useState("");

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    getUser();
  }, [filteredUsers]);
  const handleFilter = () => {
    if (filteredUsers === "") {
      setUser(user);
      return;
    }
    const filtered = user.filter(
      (user) =>
        user.username.toLowerCase().includes(filteredUsers.toLowerCase()) ||
        user.firstName.toLowerCase().includes(filteredUsers.toLowerCase()) ||
        user.lastName.toLowerCase().includes(filteredUsers.toLowerCase()) ||
        user.email.toLowerCase().includes(filteredUsers.toLowerCase()) ||
        user.phone.toString().includes(filteredUsers.toString()) ||
        user.role.includes(filteredUsers.toString())
    );
    setUser(filtered);
  };

  // sort
  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedData = [...user].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setUser(sortedData);
    setSortConfig({ key, direction });
  };

  // page
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(user.length / rowsPerPage);
  const getPageData = () => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return user.slice(start, end);
  };

  // Function to export users to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(user);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users.xlsx");
  };
  // handle form add user
  const [open, setOpen] = useState(false);

  const handleCloseForm = () => {
    setOpen(false);
  };
  const handleFormSubmit = (data) => {
    console.log("Data");
    console.log(data); // In dữ liệu ra console
    handleCloseForm(); // Đóng form sau khi submit
  };

  // edit user
  const [editUserId, setEditUserId] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  const handleEditUser = (userId) => {
    setEditUserId(userId);
  };
  const handleCloseEditForm = () => {
    setEditUserId(null);
  };

  const handleUpdateUser = (userData) => {
    // Xử lý sau khi cập nhật thành công (ví dụ: cập nhật UI, thông báo)
    console.log("Updated user data:", userData);
  };

  return (
    <html>
      <body>
        <Theme>
          <Heading as="h1" size="8">
            HRDept Company
          </Heading>
          <Box
            style={{
              background: "var(--gray-a2)",
              borderRadius: "var(--radius-3)",
            }}
          >
            <Container size="1">
              <Flex direction="row" gap="1" pb="2">
                <Flex direction="column" gap="4" pb="2">
                  <TabNav.Root color="gray">
                    <TabNav.Link href="#" active>
                      User
                    </TabNav.Link>
                    <TabNav.Link href="#">Documents</TabNav.Link>
                    <TabNav.Link href="#">Settings</TabNav.Link>
                  </TabNav.Root>
                </Flex>
              </Flex>
            </Container>
            <Container>
              <Flex justify="between">
                <Text>User</Text>
                <Flex gap="3">
                  <Button onClick={exportToExcel} variant="solid">
                    Export to Excel
                  </Button>
                  {/* <Button variant="solid">Add New User</Button> */}
                  <AlertDialog.Root open={open} onOpenChange={setOpen}>
                    <AlertDialog.Trigger asChild>
                      <Button className="Button">Add New User</Button>
                    </AlertDialog.Trigger>
                    <AlertDialog.Portal>
                      <AlertDialog.Overlay className="AlertDialogOverlay" />
                      <AlertDialog.Content className="AlertDialogContent">
                        <AlertDialog.Title className="AlertDialogTitle">
                          add new user
                        </AlertDialog.Title>
                        <AlertDialog.Description className="AlertDialogDescription">
                          {/* user detail */}
                          <FormUser onSubmit={handleFormSubmit} />
                        </AlertDialog.Description>

                        <AlertDialog.AlertDialogAction asChild>
                          <button onClick={handleCloseForm}>Đóng</button>
                        </AlertDialog.AlertDialogAction>
                      </AlertDialog.Content>
                    </AlertDialog.Portal>
                  </AlertDialog.Root>
                </Flex>
              </Flex>
            </Container>

            <Container
              style={{
                marginTop: "20px",
                paddingTop: "5px",
                paddingBottom: "5px",
              }}
            >
              <Flex gap="9">
                <Box width="500px">
                  <TextField.Root
                    size="2"
                    placeholder="Search the docs…"
                    onChange={(e) => setFilteredUsers(e.target.value)}
                  />
                </Box>

                <Select.Root
                  defaultValue="User"
                  onValueChange={setFilteredUsers}
                >
                  <Select.Trigger style={{ width: "100px" }} />
                  <Select.Content position="popper">
                    <Select.Item value="User">User</Select.Item>
                    <Select.Item value="Admin">Admin</Select.Item>
                    <Select.Item value="Editor">Editor</Select.Item>
                  </Select.Content>
                </Select.Root>

                <Button
                  onClick={handleFilter}
                  style={{ width: "100px" }}
                  variant="solid"
                >
                  Search
                </Button>
              </Flex>
              <Table.Root style={{ marginTop: "20px" }} variant="surface">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell>#</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>
                      Phone Number
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>User Name</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell
                      onClick={() => sortData("firstName")}
                    >
                      First Name
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell
                      onClick={() => sortData("lastName")}
                    >
                      Last Name
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell onClick={() => sortData("role")}>
                      Role
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {getPageData().map((u) => (
                    <>
                      <Table.Row>
                        <Table.RowHeaderCell>{u.id}</Table.RowHeaderCell>
                        <Table.Cell>{u.email}</Table.Cell>
                        <Table.Cell>{u.phone}</Table.Cell>
                        <Table.RowHeaderCell>{u.username}</Table.RowHeaderCell>
                        <Table.Cell>{u.firstName}</Table.Cell>
                        <Table.Cell>{u.lastName}</Table.Cell>
                        <Table.Cell>{u.role}</Table.Cell>
                        <Table.Cell>
                          {/* <Button onClick={() => handleEditUser(u.id)}>
                            Edit
                          </Button> */}
                          <AlertDialog.Root
                            open={openEdit}
                            onOpenChange={setOpenEdit}
                          >
                            <AlertDialog.Trigger asChild>
                              <Button
                                onClick={() => handleEditUser(u.id)}
                                className="Button"
                              >
                                Edit
                              </Button>
                            </AlertDialog.Trigger>
                            <AlertDialog.Portal>
                              <AlertDialog.Overlay className="AlertDialogOverlay" />
                              <AlertDialog.Content className="AlertDialogContent">
                                <AlertDialog.Title className="AlertDialogTitle">
                                  edit user
                                </AlertDialog.Title>
                                <AlertDialog.Description className="AlertDialogDescription">
                                  <EditUserForm
                                    userId={editUserId}
                                    onClose={handleCloseForm}
                                    onUpdate={handleUpdateUser}
                                  />
                                </AlertDialog.Description>

                                <AlertDialog.AlertDialogAction asChild>
                                  <button onClick={handleCloseEditForm}>
                                    Đóng
                                  </button>
                                </AlertDialog.AlertDialogAction>
                              </AlertDialog.Content>
                            </AlertDialog.Portal>
                          </AlertDialog.Root>
                        </Table.Cell>
                        <Table.Cell>Delete</Table.Cell>
                      </Table.Row>
                    </>
                  ))}
                </Table.Body>
              </Table.Root>
            </Container>
            <Container style={{ marginTop: "20px" }}>
              <Flex justify="end" gap="4">
                <Text>Rows per page</Text>
                {Array.from({ length: totalPages }, (_, index) => (
                  <Button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    disabled={currentPage === index + 1}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Text>
                  1-{rowsPerPage} of {totalPages}
                </Text>
                {/* <Button variant="solid">left</Button>
                <Button variant="solid">=</Button>
                <Button variant="solid">right</Button> */}
              </Flex>
            </Container>
          </Box>
        </Theme>
      </body>
    </html>
  );
}

export default App;
