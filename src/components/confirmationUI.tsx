import React from 'react';
import type { PopconfirmProps } from 'antd';
import { Popconfirm } from 'antd';
import styled from 'styled-components';
import { deleteEvent, getEventList } from '../api/EventSlice/eventThunk';
import { useDispatch } from 'react-redux';



interface propsData {
    data?: any;
    setSelectedList?: any;
}

const ConfirmationComponent: React.FC<propsData> = ({ data, setSelectedList }) => {
    const dispatch = useDispatch()

    const confirm = (e: any, data: any) => {
        console.log(e)
        dispatch(deleteEvent(data) as any)
        dispatch(getEventList() as any)
        setSelectedList(0)
        // message.success('Event deleted succefully');
    };

    const cancel: PopconfirmProps['onCancel'] = (e: any) => {
        console.log(e);
        // message.error('Click on No');
    };

    return (
        <Popconfirm
            title="Delete"
            description="Are you sure to delete this?"
            onConfirm={(e) => confirm(e, data)}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
        >
            <DeleteBtn className="font-semibold text-lg capitalize mr-4">Delete</DeleteBtn>
        </Popconfirm>
    )
};

export default ConfirmationComponent;

const DeleteBtn = styled.button`
    padding: 0px 12px;
    border: 1px solid gray;
    margin: 4px;
    width:100px;
    height: 30px;
    border-radius: 5px;
    cursor: pointer;
    background: rgb(127 29 29);
    color: white;
    transition: background 1s ease-in-out;
    
    &:hover{
    background:rgb(12, 53, 130);
    }

`;