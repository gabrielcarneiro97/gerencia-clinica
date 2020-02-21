import React from 'react';
import { Upload, Button, Icon } from 'antd';
import XLSX from 'xlsx';

type propTypes = {
  onUpload?: (asArr: any[]) => any;
}

export default function ConfigPlanilhaUploadBtn(props: propTypes): JSX.Element {
  const { onUpload } = props;

  return (
    <Upload
      accept=".xls, .xlsx, .csv"
      showUploadList={false}
      customRequest={() => null}
      action={(f) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target) {
            const data = new Uint8Array(e.target.result as Iterable<number>);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetNames = workbook.SheetNames;
            const res = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
            if (onUpload) onUpload(res);
          }
        };
        reader.readAsArrayBuffer(f);

        return '';
      }}
    >
      <Button>
        <Icon type="upload" />
        {' '}
        Selecionar Arquivo
      </Button>
    </Upload>
  );
}
