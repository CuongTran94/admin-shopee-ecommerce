import styled from 'styled-components';
import { Button, Input, Select, Switch } from 'antd';

const { Option } = Select;

export const Layout = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  height: 200px;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RightLayout = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledButton = styled(Button)`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  margin: 5px !important;
  background-color: palevioletred;
  border: none;
`;

export const ButtonContainer = styled.div`
  .ant-btn-primary {
    background-color: #80ff80;
    border-color: none;
  }
`;

export const StyledInput = styled(Input)`
  height: ${(props) => props.height}px;
  margin: 5px !important;
`;

export const StyledSelect = styled(Select)`
  margin: 5px !important;
  width: 100%;
`;

export const StyledOption = styled(Option)``;

export const StyledSwitch = styled(Switch)`
  margin: 5px !important;
  width: 90px !important;
`;
