import React from "react";
import { Dropdown } from "rsuite";

const CustomDropdown = ({
  title,
  trigger,
  onAddFolder,
  onDeleteFolder,
  children,
  ...rest
}) => (
  <Dropdown title={title} trigger={trigger} {...rest}>
    <Dropdown.Item onClick={onAddFolder}>Add Folder</Dropdown.Item>
    <Dropdown.Item onClick={onDeleteFolder}>Delete Folder</Dropdown.Item>
    <Dropdown.Item>Rename Folder</Dropdown.Item>
  </Dropdown>
);

export default CustomDropdown;
