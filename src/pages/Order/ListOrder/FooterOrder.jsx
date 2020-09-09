import React from 'react';
import styled from 'styled-components';

const StyleTable = styled.table`
  width: 100%;
  font-weight: 10;
  font-family: arial, sans-serif;
`;

const StyledTr = styled.tr`
  padding: 8px;
  text-align: left;
`;

const StyledTh = styled.th`
  padding: 8px;
  text-align: right;
  font-weight: normal;
`;

const StylePrice = styled.div`
  color: #e94b2c;
  font-size: ${(props) => props.fontSize}px;
`;

const FooterOrder = ({ price = 0 }) => {
  return (
    <StyleTable>
      <tbody>
        <StyledTr>
          <StyledTh>Subtotal</StyledTh>
          <StyledTh>₫{price}</StyledTh>
        </StyledTr>
        <StyledTr>
          <StyledTh>Shipping</StyledTh>
          <StyledTh>₫0</StyledTh>
        </StyledTr>
        <StyledTr>
          <StyledTh>Discount</StyledTh>
          <StyledTh>₫0</StyledTh>
        </StyledTr>
        <StyledTr>
          <StyledTh>Total</StyledTh>
          <StyledTh>
            <StylePrice fontSize={20}> ₫{price}</StylePrice>
          </StyledTh>
        </StyledTr>
      </tbody>
    </StyleTable>
  );
};

export default FooterOrder;
