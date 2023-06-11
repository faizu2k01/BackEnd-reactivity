import React, { useEffect, useState } from "react";
import { Grid, GridColumn, List, Loader, StepGroup } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../stores/store";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ActivityFilter from "./activityFilter";
import { PaginationParams } from "../../../app/models/pagination";
import InfiniteScroll from "react-infinite-scroller";
import ActivityListItemPlaceholder from "./activityListItemPlaceholder";


export default observer(function ActivityDashboard() {
  const {activityStore} = useStore();
  const {loadingActivity,pagination,setParams,loadingInitial} = activityStore;
  const [paging,setPaging] = useState(false);

  
  useEffect(()  => {
    loadingActivity();
    }, [loadingActivity])
    
  function handleParams(){
    setPaging(true);
    setParams(new PaginationParams(pagination!.currentPage+1));
    loadingActivity().then(x => setPaging(false));
  }
    
  return (
    <>
      <Grid>
        <GridColumn width="10">
          {
            loadingInitial && !paging ?
            (
             <><ActivityListItemPlaceholder/>
             <ActivityListItemPlaceholder/></> 
            ) :
            (
           <InfiniteScroll
            pageStart={0}
             loadMore={()=>handleParams}
             hasMore={!paging && !!pagination && pagination.currentPage < pagination.totalPage}
             initialLoad={false}
          >
          <ActivityList/>
          </InfiniteScroll>
            )

          }
          
        </GridColumn>
        <GridColumn width={6}>
          <ActivityFilter/>
        </GridColumn>
        <GridColumn width={10}>
            <Loader active={paging}/>
        </GridColumn>
      </Grid>

    </>
  );
})
