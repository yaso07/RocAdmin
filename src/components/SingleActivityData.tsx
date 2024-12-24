import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import { formatFullDate } from "../utils/commanFun";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventById } from "../api/EventSlice/eventThunk";
import ConfirmationComponent from "./ActivityDelete";
import Loading from "./Loading";
import { CREATE_PLACE, GET_ACTIVITY_LIST } from "../api/constant";
import { CalenderIcon, ClockIcon, CurrencyIcon, LocationIcon, MailIcon, phoneBlack, WebsiteIcon } from "../utils/images";
import { Tooltip } from "antd";
import { toast } from "react-toastify";
import Slider from "./slider";

interface ModalProps {
  dataImage?: any;
  reservationModal?: any;
  data?: any;
  setIsDrawerOpen?: any;
  setDrawerType?: any;
  setSelectedList?: any;
  showType?: string;
  selectedList?: number;
}

const SingleActivitytData: React.FC<ModalProps> = ({
  dataImage,
  data,
  setIsDrawerOpen,
  setDrawerType,
  setSelectedList,
  showType,
  selectedList,
}) => {
  const dispatch = useDispatch();
  const currentEvent = useSelector((state: any) => state.event.currentEvent);
  const loading = useSelector((state: any) => state.event.isLoading);
  const error = useSelector((state: any) => state.event.error);

  const toggleDrawer = (id: any) => {
    setIsDrawerOpen(true);

    const data = { id: id, api: showType === "place" ? CREATE_PLACE : GET_ACTIVITY_LIST };
    dispatch(fetchEventById(data) as any);
    setDrawerType("Edit");
  };

  const copylink = (copy: any) => {
    navigator.clipboard.writeText(copy);
    toast.success("copy");
  };

  const EventListData = [
    {
      name: data?.acf?.event_dates ? (
        <span>{formatFullDate(data.acf?.event_dates[0]?.date)}</span>
      ) : (
        "No events"
      ),
      image: CalenderIcon,
      width: 14,
      height: 24,
      nameValue: data?.acf?.event_dates ? true : false,
    },
    {
      name: data?.acf?.event_dates ? (
        <span>{data.acf?.event_dates[0]?.start_time}</span>
      ) : (
        "No events"
      ),
      image: ClockIcon,
      width: 16,
      height: 24,
      nameValue:
        data?.acf?.event_dates?.length && data?.acf?.event_dates[0].start_time
          ? true
          : false,
    },
    {
      name: <span>{`£ ${data?.acf?.price_to}`}</span>,
      image: CurrencyIcon,
      width: 10,
      height: 24,
      nameValue: data?.acf?.price_to ? true : false,
    },
    {
      name: (
        <Tooltip title={data?.email ? data.email : data?.acf?.email_address}>
          <span onClick={() => copylink(data?.email ? data.email : data?.acf?.email_address)}>
            <a href={`mailto: ${data?.email ? data.email : data?.acf?.email_address}`}>
              {" "}
              {data?.email ? data.email : data?.acf?.email_address}{" "}
            </a>
          </span>
        </Tooltip>
      ),
      // name: <span>{data?.email ? data.email : data?.acf?.email_address}</span>,
      image: MailIcon,
      width: 16,
      height: 24,
      nameValue: data?.email ? data.email : (data?.acf?.email_address ? true : false),
    },
    {
      name: (
        <WebsiteLink
          to={data?.website ? data.website : data?.acf?.website ? data?.acf?.website : ""}
          target="_blank">
          {data?.website ? data.website : data?.acf?.website}
        </WebsiteLink>
      ),
      image: WebsiteIcon,
      width: 16,
      height: 24,
      nameValue: data?.website ? data.website : data?.acf?.website ? true : false,
    },
    {
      name: (
        <span>{data?.formatted_address ? data?.formatted_address :
          `
          ${data?.acf?.address?.place_name}, 
          ${data?.acf?.address?.address_line_1}, 
          ${data?.acf?.address?.address_line_2},
          `}
        </span>
      ),
      image: LocationIcon,
      width: 12,
      height: 24,
      nameValue: data?.formatted_address ? data?.formatted_address :
        data?.acf?.address?.place_name ||
          data?.acf?.address?.address_line_1 ||
          data?.acf?.address?.address_line_2
          ? true
          : false,
    },
    {
      name:

        data?.international_phone_number ? (
          <Tooltip title={"Copy international number"}>
            <span
              onClick={() =>
                copylink(data?.international_phone_number)
              }>
              <Link to={`tel:${data?.international_phone_number}`}>
                {data?.international_phone_number}
              </Link>
            </span>
          </Tooltip>
        ) : (
          <Tooltip title={"Copy contact number"}>
            <span
              onClick={() => copylink(data?.acf?.telephone_number?.formatted)}>
              {data?.acf?.telephone_number?.formatted}
            </span>
          </Tooltip>
        ),
      image: phoneBlack,
      nameValue: data?.international_phone_number
        ? data?.international_phone_number
        : data?.acf?.telephone_number?.formatted
          ? true
          : false,
    },
  ];

  const daysOfWeek = Object.keys(data?.acf?.opening_hours ?? {});
  const daysOfWeekTiming = Object.values(data?.acf?.opening_hours ?? {}) as {
    opens: string;
    closes: string;
  }[];

  const formattedValues = () => {
    const typeData = data?.acf?.type;
    if (Array.isArray(typeData)) {
      return data?.acf?.type.map((item: any) => item?.label).join(" | ");
    } else {
      return data?.acf?.type?.label;
    }
  };

  const strippedContent = data?.acf?.short_description
    ? data?.acf?.short_description
      .replace(/<p[^>]*>/g, "")
      .replace(/<\/p>/g, "")
    : data?.editorial_summary?.overview;

  // const formatRoute = (routeText: any) => {
  //     return routeText ? routeText
  //         .replace("<br>", ": ")
  //         .replace("<i>", "")
  //         .replace("</i>", "")
  //         .replace(/(\()/, "")
  //         .replace(/\)/, "") : ""
  // };

  // const handleDelete = (id: string) => {
  //     dispatch(deleteEvent(id) as any)
  //     dispatch(getEventList() as any)
  // }

  useEffect(() => {
    if (!loading && error === "") {
      // dispatch(getEventList() as any)
      setIsDrawerOpen(false);
    }
  }, [currentEvent]);

  const opningDate = useCallback((val: any) => {
    return val.map((item: any) => {
      const [day, time] = item.split(": ");
      return { day, time };
    });
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : data ? (
        <Container className="overflow-y-auto max-h-[calc(100dvh-90px)] hide-scrollbar">
          <Title className="">
            <h1 className="font-semibold text-lg capitalize">
              {data?.acf?.title || data?.name}
            </h1>
            <div className="">
              <EditBtn
                className="font-semibold text-lg capitalize mr-4 "
                onClick={() => toggleDrawer(data?._id)}>
                Edit
              </EditBtn>
              <ConfirmationComponent
                data={data?._id}
                {...{ setSelectedList, showType, selectedList }}
              />
            </div>
          </Title>

          <ResturatContainer>
            <ResturatWrapper>
              <p style={{ fontSize: "16px", textTransform: 'capitalize', fontWeight: '600' }}>{formattedValues()}</p>
            </ResturatWrapper>
          </ResturatContainer>
          <ItemImageContainer>
            {
              (showType === "place" && dataImage) ?
                <Slider slides={dataImage} />
                :

                <img
                  src={
                    dataImage
                      ? dataImage
                      : "https://firebasestorage.googleapis.com/v0/b/roc-web-app.appspot.com/o/display%2FNo_Image_Available.jpg?alt=media&token=90cbe8cc-39f6-45f9-8c4b-59e9be631a07"
                  }
                  alt="Logo"
                  width={200}
                  // height={150}
                  style={{ borderRadius: 4, maxWidth: "100%", objectFit: "cover" }}
                />
            }
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
          <AlsoSeeText>Description</AlsoSeeText>
          <RestDetailText>{strippedContent}</RestDetailText>

          {/* {data?.acf?.event_dates != "" && (
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
                            )} */}

          {data?.acf?.key_facilities && (
            <>
              <AlsoSeeText>Key Features</AlsoSeeText>
              <BulletPointWrapper style={{ marginLeft: 40 }}>
                {data?.acf?.key_facilities.map((item: any, index: any) => (
                  <li key={index}>{item.label}</li>
                ))}
              </BulletPointWrapper>
            </>
          )}

          {data?.acf?.accessibility && (
            <>
              <AlsoSeeText>Accessibility</AlsoSeeText>
              <BulletPointWrapper style={{ marginLeft: 40 }}>
                {data?.acf?.accessibility.map((item: any, index: any) => (
                  <li key={index}>{item?.label}</li>
                ))}
              </BulletPointWrapper>
            </>
          )}

          {data?.acf?.bus_routes && (
            <>
              <AlsoSeeText>Bus Route</AlsoSeeText>
              <BulletPointWrapper style={{ marginLeft: 40 }}>
                {data?.acf?.bus_routes.map((item: any, index: any) => (
                  <li key={index} style={{ textDecoration: "underline" }}
                    dangerouslySetInnerHTML={{ __html: item.label }}
                  >
                    {/* {formatRoute(item.label)}
                                                {
                                                    console.log(item?.label

                                                    )
                                                } */}
                  </li>
                ))}
              </BulletPointWrapper>
            </>
          )}
          {
            data?.acf?.seasonality &&
            <AlsoSeeText>Seasonality</AlsoSeeText>
          }
          {
            data?.acf?.seasonality &&
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
              </OpningDatesContainer>
            </BulletPointWrapper>
          }
          <AlsoSeeText>Opening hours</AlsoSeeText>
          <BulletPointWrapper>
            {
              data?.current_opening_hours ?
                <DatesWrapperTextGoogle>
                  {data?.current_opening_hours?.weekday_text &&
                    opningDate(
                      data?.current_opening_hours?.weekday_text
                    ).map((item: any, index: any) => (
                      <p
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                        }}>
                        <p>{item?.day}</p>
                        <p>{item?.time}</p>
                      </p>
                    ))}
                </DatesWrapperTextGoogle>
                :

                <OpningDatesContainer>
                  {daysOfWeek.map(
                    (item, index) =>
                      daysOfWeekTiming[index].opens && (
                        <WeekTimeArrange key={index}>
                          <p>{item}:</p>
                          <p>
                            {daysOfWeekTiming[index].opens} - {" "}
                            {daysOfWeekTiming[index].closes}
                          </p>
                        </WeekTimeArrange>
                      )
                  )}
                </OpningDatesContainer>
            }
          </BulletPointWrapper>
        </Container>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 17v-6h6v6m-6 4h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm6 0H9m3-16.5V9m0 0L15 6m-3 3L9 6"></path>
          </svg>
          <p className="text-gray-500 text-lg">No data available</p>
        </div>
      )}
    </>
  );
};

export default SingleActivitytData;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const EditBtn = styled.button`
  padding: 0px 12px;
  border: 1px solid gray;
  margin: 4px;
  border-radius: 5px;
  cursor: pointer;
  background: #1e2832;
  color: white;
  transition: background 1s ease-in-out;
  &:hover {
    background: red;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
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
  height: 150px;
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

const WeekTimeArrange = styled.div`
  display: flex;
  gap: 10px;
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
  margin: 0px 24px;
  border-radius: 8px;
  background: var(--White, #fff);
  padding-bottom: 15px;
`;

const WebsiteLink = styled(Link)`
  &:hover {
    text-decoration: underline;
    text-decoration-color: lightblue;
    color: lightblue;
  }
`;

const DatesWrapperTextGoogle = styled.div`
  color: var(--BODY, #000);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  /* flex-wrap: wrap;
  gap: 3px; */

  p {
    flex: 1;
  }
`;

