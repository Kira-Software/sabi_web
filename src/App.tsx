import React ,{useState, useEffect} from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, Upload } from 'antd';
import './App.css';
import { Space, Table, Tag,message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';


const props: UploadProps = {
  name: 'files',
  action: 'http://localhost:7000/upload',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      window.location.href = "/";
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  beforeUpload(info){
    if(info.size > 10 * 1024 * 1024){
      message.error(`file too large. (Max 10MB)`);
      return false;
    }
  }
};


interface DataType {
  key: string;
  createdAt: string;
  file_name: number;
  file_size: string;
  id: number;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'createdAt',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: 'file_name',
    dataIndex: 'file_name',
    key: 'file_name',
  },
  {
    title: 'file_size',
    dataIndex: 'file_size',
    key: 'file_size',
  },

  {
    title: 'Action',
    key: 'action',
    render: (_, record) =>{
      const deleteRow = (id: number) => {
        axios.delete(`http://localhost:7000/upload?id=${record.id}`).then(result => {
      
           message.success(`file deleted`);
            setTimeout(() => {
          window.location.href = "/";
        },2000)
        
        })

      
        
      } 
      return(
        <Space size="middle">
          <Tag color='volcano' >
             <a onClick={()=> deleteRow(record.id)}>Delete {record.id}</a>
            </Tag>
   
        </Space>
      );
    } ,
  },
];


const App: React.FC = () => {

  const [files,setFiles] = useState();

  useEffect(() => {
      axios.get("http://localhost:7000/upload").then(result => {
        setFiles(result.data.data);
      })
  }, [])

return(
     <div  className="App progress">
      <Upload {...props} >
        <Button icon={<UploadOutlined />}>Upload</Button>
      </Upload>
      <div style={{marginTop: "100px"}}> 
      <Table columns={columns} dataSource={files} />
     </div>
    </div>

);
 
}

export default App;
