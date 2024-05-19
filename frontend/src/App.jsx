import React, { useState, useEffect } from "react";
import {
  Container,
  Divider,
  Header,
  Heading,
  Tree,
  Content,
  Footer,
} from "rsuite";
import FolderFillIcon from "@rsuite/icons/FolderFill";
import PageIcon from "@rsuite/icons/Page";
import axios from "axios";
import CustomDropdown from "./CustomDropdown";

const TreeNode = ({ children, ...rest }) => {
  return (
    <div
      {...rest}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      {children}
    </div>
  );
};

const App = () => {
  const [value, setValue] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/categories");
      console.table(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchChildren = async (parentNode) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/categories/${parentNode.category_id}`
      );
      return response.data.map((node) => ({
        ...node,
        label: node.name,
        value: node.category_id.toString(),
        children: node.children ? [] : undefined,
      }));
    } catch (error) {
      console.error("Error fetching children:", error);
      return [];
    }
  };

  // SECTION Add Folder
  const addNewFolder = async (parentNode) => {
    console.log(parentNode);
    const newFolderName = prompt("Enter name for new folder");
    if (newFolderName) {
      try {
        const response = await axios.post(
          `http://localhost:3000/categories/${parentNode}/new`,
          { name: newFolderName }
        );
        if (response.status === 201) {
          fetchData();
        } else {
          console.error("Failed to add new folder.");
        }
      } catch (error) {
        console.error("Error adding new folder:", error);
      }
    }
  };

  // SECTION Delete Folder
  const deleteFolder = async (folderId) => {
    console.log(folderId);
    if (window.confirm("Are you sure you want to delete this folder?")) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/categories/${folderId}`
        );
        if (response.status === 200) {
          fetchData();
        } else {
          console.error("Failed to delete folder.");
        }
      } catch (error) {
        console.error("Error deleting folder:", error);
      }
    }
  };
  return (
    <Container
      style={{
        padding: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50%",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Header>
        <Heading>Tree Structure File Management</Heading>
      </Header>

      <Divider />

      <Content style={{ backgroundColor: "#F8F4E1", width: "100%" }}>
        <Tree
          showIndentLine
          disabledItemValues={["1"]}
          defaultExpandAll
          data={data}
          value={value}
          getChildren={fetchChildren}
          onChange={(value) => setValue(value)}
          renderTreeNode={(node) => (
            <CustomDropdown
              title={node.label}
              trigger="contextMenu"
              onAddFolder={() => addNewFolder(node.value)}
              onDeleteFolder={() => deleteFolder(node.value)}
            >
              <TreeNode>
                {node.children ? <FolderFillIcon /> : <PageIcon />} {node.label}
              </TreeNode>
            </CustomDropdown>
          )}
        />
      </Content>

      <Footer>Footer</Footer>
    </Container>
  );
};

export default App;
