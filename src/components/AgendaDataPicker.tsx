import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { Store } from '../store/store';
import { AgendaStore, carregarData } from '../store/agenda';

export default function AgendaDataPicker(): JSX.Element {
  const { data } = useSelector<Store, AgendaStore>((store) => store.agenda);
  const dispatch = useDispatch();

  const setData = (d: Moment | null): void => {
    dispatch(carregarData(d));
  };

  useEffect(() => {
    setData(moment());
  }, []);

  return (
    <DatePicker format="DD/MM/YYYY" value={data} onChange={setData} />
  );
}
