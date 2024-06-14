import React, { useEffect } from "react";
import styled from "styled-components";
import { formatCalenderTime, formatDate, formatDay, formatFullDate, formatMonth } from "../utils/commanFun";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventById, getEventList } from "../api/EventSlice/eventThunk";
import ConfirmationComponent from "./confirmationUI";






interface ModalProps {
    dataImage?: any;
    reservationModal?: any;
    data?: any;
    setIsDrawerOpen?: any;
    setDrawerType?: any;
}


const SingleEventData: React.FC<ModalProps> = ({
    dataImage,
    data,
    setIsDrawerOpen,
    setDrawerType,

}) => {
    const dispatch = useDispatch();
    const currentEvent = useSelector((state: any) => state.event.currentEvent)
    const loading = useSelector((state: any) => state.event.isLoading)
    const error = useSelector((state: any) => state.event.error)

    const toggleDrawer = () => {
        setIsDrawerOpen(true);
        dispatch(fetchEventById(data) as any)
        setDrawerType("Edit")
    };

    const EventListData = [
        {
            name: data?.acf?.event_dates
                ? (

                    <span>
                        {formatFullDate(data.acf?.event_dates[0]?.date)}
                    </span>

                )
                : "No events",
            // name: "ssds",
            image:
                "https://firebasestorage.googleapis.com/v0/b/roc-web-app.appspot.com/o/display%2FIcon%2FEventICON%2Fcalendar.png?alt=media&token=4dcb085b-44bc-4182-8893-27dda5f0325f",
            width: 14,
            height: 24,
            nameValue: data?.acf?.event_dates ? true : false,
        },
        {
            name: data?.acf?.event_dates
                ? (

                    <span >
                        {data.acf?.event_dates[0]?.start_time}
                    </span>

                )
                : "No events",
            // name: "sdsd",
            image:
                "https://firebasestorage.googleapis.com/v0/b/roc-web-app.appspot.com/o/display%2FIcon%2FEventICON%2Fclock.png?alt=media&token=5f80c9da-b46f-4c37-8018-db55c0cfd72e",
            width: 16,
            height: 24,
            nameValue: data?.acf?.event_dates?.length && data?.acf?.event_dates[0].start_time ? true : false,
        },
        {
            name:

                <span >
                    {`£ ${data?.acf?.price_to}`}
                </span>
            ,
            image:
                "https://firebasestorage.googleapis.com/v0/b/roc-web-app.appspot.com/o/display%2FIcon%2FEventICON%2Fgbp.png?alt=media&token=30f60889-d511-46d9-a8ce-30ef112929e8",
            width: 10,
            height: 24,
            nameValue: data?.acf?.price_to ? true : false,
        },
        {
            name:

                <span >
                    {data?.acf?.email_address}
                </span>
            ,
            image:
                "https://firebasestorage.googleapis.com/v0/b/roc-web-app.appspot.com/o/display%2FIcon%2FEventICON%2Fenvelope.png?alt=media&token=08ba6331-d66b-485c-b274-4d85de7f76b0",
            width: 16,
            height: 24,
            nameValue: data?.acf?.email_address ? true : false,
        },
        {
            name: <WebsiteLink to={data?.acf?.website ? data?.acf?.website : ""} target="_blank">
                {data?.acf?.website}
            </WebsiteLink>,
            image:
                "https://firebasestorage.googleapis.com/v0/b/roc-web-app.appspot.com/o/display%2FIcon%2FEventICON%2Fglobe.png?alt=media&token=0fa8a5a4-35c8-46ae-bb83-45c00d6d7328",
            width: 16,
            height: 24,
            nameValue: data?.acf?.website ? true : false,
        },
        {
            name:

                <span >
                    {data?.acf?.address.place_name}, {data?.acf?.address.address_line_1}, {data?.acf?.address?.address_line_2},
                </span>,
            image:
                "https://firebasestorage.googleapis.com/v0/b/roc-web-app.appspot.com/o/display%2FIcon%2FEventICON%2Flocation-dot.png?alt=media&token=d6ea3348-daab-4b8e-acb6-977148c16e1f",
            width: 12,
            height: 24,
            nameValue: (data?.acf?.address?.place_name || data?.acf?.address?.address_line_1 || data?.acf?.address?.address_line_2) ? true : false,
        },
    ];

    const daysOfWeek = Object.keys(data?.acf?.opening_hours ?? {});
    const daysOfWeekTiming = Object.values(data?.acf?.opening_hours ?? {}) as {
        opens: string;
        closes: string;
    }[];


    const formattedValues = () => {
        const typeData = data?.acf?.type
        if (Array.isArray(typeData)) {
            return data?.acf?.type.map((item: any) => item?.label).join(" | ");
        } else {
            return data?.acf?.type?.label;
        }
    };

    const strippedContent = data?.acf?.short_description
        .replace(/<p[^>]*>/g, "")
        .replace(/<\/p>/g, "");

    const formatRoute = (routeText: any) => {
        return routeText
            .replace("<br>", ": ")
            .replace("<i>", "")
            .replace("</i>", "")
            .replace(/(\()/, "")
            .replace(/\)/, "");
    };

    // const handleDelete = (id: string) => {
    //     dispatch(deleteEvent(id) as any)
    //     dispatch(getEventList() as any)
    // }

    useEffect(() => {
        if (!loading && error === '') {

            dispatch(getEventList() as any)
            setIsDrawerOpen(false);
        }
    }, [currentEvent])

    return (
        <>
            {
                data ?

                    <Container className="overflow-y-auto max-h-[calc(100dvh-90px)] hide-scrollbar">
                        <Title className="">
                            <h1 className="font-semibold text-lg capitalize">{data?.acf?.title}</h1>
                            <div className="">
                                <EditBtn className="font-semibold text-lg capitalize mr-4" onClick={() => toggleDrawer()}>Edit</EditBtn>
                                <ConfirmationComponent data={data?._id} />
                            </div>
                        </Title>

                        <ResturatContainer>
                            <ResturatWrapper>
                                <p style={{ fontSize: "14px", textTransform: 'capitalize' }}>{formattedValues()}</p>
                            </ResturatWrapper>
                        </ResturatContainer>
                        <ItemImageContainer>
                            <img
                                src={
                                    dataImage
                                        ? dataImage
                                        : "https://firebasestorage.googleapis.com/v0/b/roc-web-app.appspot.com/o/display%2FNo_Image_Available.jpg?alt=media&token=90cbe8cc-39f6-45f9-8c4b-59e9be631a07"
                                }
                                alt="Logo"
                                width={200}
                                height={80}
                                style={{ borderRadius: 4, maxWidth: "100%", objectFit: "cover" }}
                            />
                        </ItemImageContainer>
                        <ResturantDetailsContainer>
                            {EventListData.map((item: any, index: number) => {

                                return (
                                    item?.nameValue &&
                                    <ResturantDetailsWrapper key={index}>
                                        {" "}
                                        <div style={{ width: 20 }}>
                                            <img
                                                style={{ cursor: "pointer", height: "auto" }}
                                                src={item.image}
                                                width={item.width}
                                                height={item.height}
                                                alt="Logo Outline"
                                            />{" "}
                                        </div>
                                        {index == 4 ? (
                                            <RestDetailTitleWebsite href={item?.name} target="_blank">
                                                {item?.name}
                                            </RestDetailTitleWebsite>
                                        ) : (
                                            <RestDetailTitle>{item?.name}</RestDetailTitle>
                                        )}
                                    </ResturantDetailsWrapper>
                                );
                            })}
                            {/* <ViewDirection onClick={() => reservationModal("DirectionModal")}>
                    View Directions
                </ViewDirection> */}
                        </ResturantDetailsContainer>
                        <RestDetailText>{strippedContent}</RestDetailText>

                        {data?.acf?.event_dates != "" && (
                            <>
                                <AlsoSeeText>More dates</AlsoSeeText>
                                {data?.acf?.event_dates?.map((item: any, index: any) => (
                                    <DatesContainer key={index}>
                                        <DatesWrapperText>
                                            <p>{formatCalenderTime(item?.date)}</p>
                                            <p>{formatDay(item?.date)}</p>
                                            <p>{item?.start_time}</p>
                                        </DatesWrapperText>
                                        <DateMonthWraaper>
                                            <p style={{ fontSize: 17 }}>{formatDate(item.date)}</p>
                                            <Monthstyle>{formatMonth(item?.date)}</Monthstyle>
                                        </DateMonthWraaper>
                                    </DatesContainer>
                                ))}
                            </>
                        )}

                        {data?.acf?.key_facilities != "" && (
                            <>
                                <AlsoSeeText>Key Features</AlsoSeeText>
                                <BulletPointWrapper style={{ marginLeft: 40 }}>
                                    {data?.acf?.key_facilities.map((item: any, index: any) => (
                                        <li key={index}>{item.label}</li>
                                    ))}
                                </BulletPointWrapper>
                            </>
                        )}

                        {data?.acf?.accessibility != "" && (
                            <>
                                <AlsoSeeText>Accessibility</AlsoSeeText>
                                <BulletPointWrapper style={{ marginLeft: 40 }}>
                                    {data?.acf?.accessibility.map((item: any, index: any) => (
                                        <li key={index}>{item?.label}</li>
                                    ))}
                                </BulletPointWrapper>
                            </>
                        )}

                        {data?.acf?.bus_routes != "" && (
                            <>
                                <AlsoSeeText>Bus Route</AlsoSeeText>
                                <BulletPointWrapper style={{ marginLeft: 40 }}>
                                    {data?.acf?.bus_routes.map((item: any, index: any) => (
                                        <li key={index} style={{ textDecoration: "underline" }}>
                                            {formatRoute(item.label)}
                                        </li>
                                    ))}
                                </BulletPointWrapper>
                            </>
                        )}

                        <AlsoSeeText>Opening</AlsoSeeText>
                        <BulletPointWrapper>
                            <OpningDatesContainer>


                                <DatesWrapperText>
                                    {data?.acf?.seasonality &&
                                        data?.acf?.seasonality.map((item: any, index: any) => (
                                            <p key={index}>
                                                {item?.label}
                                                {index !== data?.acf?.seasonality.length - 1 && ","}{" "}
                                            </p>
                                        ))}
                                </DatesWrapperText>


                                {
                                    daysOfWeek.map((item, index) => (
                                        <WeekTimeArrange key={index}>
                                            <p>{item}:</p>
                                            <p>
                                                {daysOfWeekTiming[index].opens} - {daysOfWeekTiming[index].closes}
                                            </p>
                                        </WeekTimeArrange>
                                    ))
                                }

                            </OpningDatesContainer>
                        </BulletPointWrapper>
                    </Container>
                    :
                    ""
            }


        </>
    );
};

export default SingleEventData;

const Title = styled.div`
display: flex;
justify-content: space-between;
width:100%;
`;

const EditBtn = styled.button`
    padding: 0px 12px;
    border: 1px solid gray;
    margin: 4px;
    border-radius: 5px;
    cursor: pointer;
    background: #1e2832;
    color: white;
    &:hover{
    
    background: red;
    transaction: .3s
    }

`;


const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ResturatContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0px 24px;
`;

const ResturatWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;



const ResturantDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0px 24px;
`;

// const ViewDirection = styled.div`
//   color: #2f80ed;
//   font-size: 16px;
//   font-style: normal;
//   font-weight: 400;
//   margin-left: 24px;
//   cursor: pointer;
// `;

const ResturantDetailsWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const RestDetailTitle = styled.p`
  color: var(--BODY, #000);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
`;


const RestDetailText = styled.p`
  color: #000;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
  padding: 0px 24px;
`;

// const ScrollingMenu = styled.div`
//   display: flex;
//   overflow: auto;
//   gap: 8px;
//   padding: 0px 24px;

//   &::-webkit-scrollbar {
//     display: none;
//   }
// `;




const AlsoSeeText = styled.p`
  color: #000;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-left: 24px;
`;



const DatesContainer = styled.div`
  padding: 8px 16px;
  margin: 0px 24px;
  border-radius: 8px;
  background: var(--White, #fff);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 88px;
`;

const DatesWrapperText = styled.div`
  color: var(--BODY, #000);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
`;

const RestDetailTitleWebsite = styled.a`
  color: var(--BODY, #000);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
  /* text-decoration: underline; */
  display: block;
  width: 100%; /* Ensures the link takes up the full width of its container */
  white-space: nowrap; /* Prevents wrapping of the link text */
  overflow: hidden; /* Hides any overflowing content */
  text-overflow: ellipsis;
`;

const ItemImageContainer = styled.div`
  padding: 0px 24px;
`;

// const ImageWrraper = styled(Image)`
//   border-radius: 6px;
//   width: 342px;
//   height: 192px;
//   /* width: -webkit-fill-available !important;
//   height: 192px !important; */

//   @media screen and (max-width: 1130px) {
//     height: auto;
//     width: -webkit-fill-available;
//   }
// `;

const BulletPointWrapper = styled.ul`
  list-style-type: disc;
  color: black;

  li {
    color: var(--BODY, #000);
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 150% */
  }
`;

const DateMonthWraaper = styled.div`
  border-radius: 4px;
  background: rgb(242, 242, 242);
  text-align: center;
  font-weight: bold;
`;

const Monthstyle = styled.p`
  background: red;
  font-size: 10px;
  color: white;
  padding: 0px 5px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  text-transform: uppercase;
`;

const WeekTimeArrange = styled.div`
  display: flex;
  gap:10px;
  align-items: center;

  p {
    color: var(--BODY, #000);
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 150% */
    text-transform: capitalize;
  }
`;


const OpningDatesContainer = styled.div`
  padding: 16px 16px;
  margin: 0px 24px;
  border-radius: 8px;
  background: var(--White, #fff);
`;

const WebsiteLink = styled(Link)`
  &:hover {
    text-decoration: underline;
    text-decoration-color: lightblue;
    color: lightblue;
  }
`;