import React from 'react';
import type { PopconfirmProps } from 'antd';
import { Popconfirm } from 'antd';
import styled from 'styled-components';
import { deleteActivity } from '../api/EventSlice/eventThunk';
import { useDispatch } from 'react-redux';
import { CREATE_ACTIVITY, CREATE_PLACE } from '../api/constant';



interface propsData {
    data?: any;
    showType?: any;
    setSelectedList?: any;
    selectedList?: number;
}

const ConfirmationComponent: React.FC<propsData> = ({ data, showType, setSelectedList, selectedList }) => {

    const dispatch = useDispatch()

    const confirm = async (e: any, data: any) => {
        console.log(e)
        const param = { api: showType === 'place' ? CREATE_PLACE : CREATE_ACTIVITY, id: data }
        const res = await dispatch(deleteActivity(param) as any)
        
        if(res.type === "activity/delete/fulfilled" && selectedList){
            setSelectedList(selectedList > 0 ? selectedList - 1 : selectedList)
        }
        // showType === 'place' ? dispatch(getPlaceList() as any) : dispatch(getActivityList() as any);
    };

    const cancel: PopconfirmProps['onCancel'] = (e: any) => {
        console.log(e);
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
    border-radius: 5px;
    cursor: pointer;
    background: rgb(127 29 29);
    color: white;
    &:hover{
    
    background: rgb(239 68 68);
    transaction: .3s
    }

`;