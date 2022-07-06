import router from 'next/router';
import React,{useEffect,useState} from 'react'
import TicketChat from '../../component/TicketChat'
import styled from 'styled-components';

const TicketReply = () => {
  
  return (
    <Main>
      <TicketChat Ticketid={localStorage.getItem("TicketUid")} />
    </Main>

  )
}

const Main = styled.div`
  margin-top: 99px;
`;

export default TicketReply