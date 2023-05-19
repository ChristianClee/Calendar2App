import React, { useEffect, useState } from 'react';
import InnerSquare from './elements/InnerSquare';
import { useSelector, useDispatch } from 'react-redux';
import { selectDate, addToTemporatyStorage, changeActivDate } from '../../../redux/slices/dateSlice';
import { DownLoadedWeek } from '../../../redux/slices/dateSlice';
// @ts-ignore
import lodash from 'lodash'

const Events: React.FC = () => {
  const dispatch = useDispatch()
  const { listOfWeekDays, listOfAllWeeks, temporatyStorageWeek } = useSelector(selectDate)




  useEffect(() => {
    if (listOfWeekDays.length === 7) { // it cheks on empty WeekDays's list, it needs because react launch precheking code befor main launch 
      if (listOfAllWeeks.length === 0) {   // it addes new week immedeately if AllWeeks's list is empty
        const value = createList(listOfWeekDays)
        const week = { "uniqKey": listOfWeekDays[0], "value": value }
        dispatch(addToTemporatyStorage( week ))
       
        // console.log("listOfAllWeeks ", listOfAllWeeks)
      }
      // @ts-ignore   I want to use 'findLast' method because it is razor then 'find' in this case, but TS doesn't allow me do it
      else if (!listOfAllWeeks.findLast((item: DownLoadedWeek) => item.uniqKey === listOfWeekDays[0])) { // it searches WeekDays in AllWeeks and if it hasn't done neccessary value it creates new one and adds it to rest 
        const value = createList(listOfWeekDays)                        //       todo you can improve it
        const week = { "uniqKey": listOfWeekDays[0], "value": value }
        dispatch(addToTemporatyStorage(week))
        // console.log("listOfAllWeeks ", listOfAllWeeks)
      }
      else {
        //@ts-ignore 
        const week = listOfAllWeeks.findLast((item: DownLoadedWeek) => item.uniqKey === listOfWeekDays[0])
        //@ts-ignore    here won't be undefind , I checked it above #1 in 'else if' block
        dispatch(addToTemporatyStorage(week))
        // setGredList(week)
        
      }
    }

  }, [listOfWeekDays])

  function createList(listOfWeekDays: string[]): string[] {
    let innerSquares = []
    for (let i = 1; i < 24; i++) { // this double cycle generates array whis unique value, each value has '2023-05-18-Thursday-01'
      for (let j = 0; j < 7; j++) {
        const timeNumber = (String(i).length < 2) ? "0" + String(i) + "-f" : String(i) + "-f"
        innerSquares.push(`${listOfWeekDays[j]}-${timeNumber}`)
      }
    }
    return innerSquares
  }
  function makeTrack(index: number, active: string) {
    const clon = JSON.parse(JSON.stringify(temporatyStorageWeek))
    clon.value[index] = active
    dispatch(addToTemporatyStorage(clon)) // it saves changes it to temporaty Storage
    dispatch(changeActivDate(active.slice(0, 15))) // it change active date
  }
  
  return (
    
    <div className="greed__events">
      { Boolean(temporatyStorageWeek.value.length) &&
    
        temporatyStorageWeek.value.map((item, index: number) => <InnerSquare key={item} value={item} func={makeTrack} index={index} />)
      }
    </div>
  );
}

export default Events;