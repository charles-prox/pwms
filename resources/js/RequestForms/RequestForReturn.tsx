import { Page, Font, Document, Text, StyleSheet, PDFViewer, View, Image } from "@react-pdf/renderer";
import React from "react";
import Cookies from "js-cookie";

const today = new Date();
const month = today.toLocaleString('default', { month: 'long' });
const day = String(today.getDate()).padStart(2, '0');
const year = today.getFullYear();

const formattedDate = `${month} ${day}, ${year}`;


export default function RequestForReturn (props) {
  const { data } = props;
  const [innerHeight,setInnerHeight] = React.useState(0);
  const [innerWidth,setInnerWidth] = React.useState(0);
  const office_head = Cookies.get("office_head");

  // console.log("data: "+JSON.stringify(data.data.details));
  
  
  React.useEffect(()=>{
    setInnerWidth(window.innerWidth);
    setInnerHeight(window.innerHeight);
  },[])

  return (
    <PDFViewer width={innerWidth} height={innerHeight} showToolbar={true}>
      <Document >
        <Page style={styles.body} size="A4">
          <View fixed style={[styles.header, styles.flex]}>
            <View style={{width: '20%'}}>
              <Image
                style={styles.logo}
                src="/headers/philhealth_logo.png"
              />
            </View>
            <View style={{width: '80%', position: 'relative', height: 70}}>
              <Text style={[styles.title, styles.boldFont]}>Request for Return of Records Form</Text>
              <Text style={styles.formNo}>PHILHEALTH-QP-02-F03</Text>
            </View>
          </View>
          <View style={[styles.flex, styles.date]}>
            <View style={{width: '10%'}}>
              <Text >Date:</Text>
            </View>
            <View style={{width: '90%'}}>
              <Text style={{textDecoration:'underline'}}>{formattedDate}</Text>
            </View>
          </View>
          <Text style={styles.rsfno}>RRF No.:   <Text style={{textDecoration: 'underline'}}>{data.data.form_no}</Text></Text>
          <View style={styles.flex}>
            <View style={{width: '10%'}}>
              <Text >TO:</Text>
            </View>
            <View style={{width: '90%'}}>
              <Text >GLADYS A. ELTANAL</Text>
              {/* <Text >Chief/Head</Text> */}
            </View>
          </View>
          <View style={styles.flex}>
            <View style={{width: '10%'}}>
              <Text ></Text>
            </View>
            <View style={{width: '90%'}}>
              <Text >Head, GSU</Text>
            </View>
          </View>
          
          <Text style={styles.salutation}>Sir/Ma'am,</Text>
          <Text style={styles.letterBody}>May we return the following records.</Text>
          <Text style={styles.horizontalLine}> </Text>
          {/* Table Header */}
          
              <View style={styles.flex}>
                <View style={[styles.border,styles.tableHeader,{width: '20%'}]}>
                  <Text>Box Code</Text>
                </View>
                <View style={[styles.border,styles.tableHeader,{width: '45%'}]}>
                  <Text>Document Description</Text>
                </View>
                <View style={[styles.border,styles.tableHeader,{width: '18%'}]}>
                  <Text>Copy Type</Text>
                </View>
                <View style={[styles.border,styles.tableHeader,{width: '20%'}]}>
                  <Text>Box Location</Text>
                </View>
              </View>
          
          {/* Table Body */}
          {
            data.data.details.map((box,index)=>(
              // console.log(JSON.stringify(box.box_details[0].rds_number));
              
              <View style={styles.flex} key={"row-"+index}>
                <View style={[styles.border,styles.tableCell,{width: '20%'}]}>
                      <Text>{box.box_code}</Text>
                </View>
                <View style={[styles.border,styles.tableCell,{width: '45%'}]}>
                      <Text>{box.remarks}</Text>
                </View>
                <View style={[styles.border,styles.tableCell,{width: '18%'}]}>
                      <Text>{box.copy_type}</Text>
                </View>
                <View style={[styles.border,styles.tableCell,{width: '20%'}]}>
                      <Text>{box.location}</Text>
                </View>
              </View>
            ))
            }
          <Text style={{fontSize:10, padding:5}}>
          Note: The Records Section shall not be responsible for any loss of the box's contents.
          </Text>
          {/* Prepared by */}
          <View wrap={false} style={{marginTop:10}}>
          <Text style={[styles.signatoryFor,styles.border]}>Prepared by:</Text>
            <View style={styles.flex}>
              <View style={[styles.border,styles.tableCell,{width: '55%'}]}>
                <Text style={styles.signatoryName}>{data.data.user_name}</Text>
              </View>
              <View style={[styles.border,styles.tableCell,{width: '50%'}]}>
                <Text></Text>
              </View>
            </View>
            <View style={styles.flex}>
              <View style={[styles.border,styles.tableCell,{width: '55%'}]}>
                <Text style={styles.signatoryPosition}>Signature over Printed Name</Text>
                <Text style={styles.signatoryPosition}>Document Custodian, {data.data.office}</Text>
              </View>
              <View style={[styles.border,styles.tableCell,{width: '50%'}]}>
                <Text style={styles.signatoryPosition}>Date</Text>
              </View>
            </View>
          </View>
          {/* Signatories */}
          <View wrap={false} >
            <View style={styles.flex}>
            <Text style={[styles.signatoryFor,styles.border,{width: '55%'}]}>Requesting Officer:</Text>
            <Text style={[styles.signatoryFor,styles.border,{width: '55%'}]}>Received by:</Text>
            </View>
            <View style={styles.flex}>
              <View style={[styles.border,styles.tableCell,{width: '35%'}]}>
                <Text style={styles.signatoryName}>{office_head}</Text>
              </View>
              <View style={[styles.border,styles.tableCell,{width: '20%'}]}>
                <Text></Text>
              </View>
              <View style={[styles.border,styles.tableCell,{width: '35%'}]}>
                <Text style={styles.signatoryName}>CHERRY MAE G. SERIÑA</Text>
              </View>
              <View style={[styles.border,styles.tableCell,{width: '20%'}]}>
                <Text></Text>
              </View>
            </View>
            <View style={styles.flex}>
              <View style={[styles.border,styles.tableCell,{width: '35%'}]}>
                <Text style={styles.signatoryPosition}>Signature over Printed Name</Text>
                <Text style={styles.signatoryPosition}>Head,{data.data.office}</Text>
              </View>
              <View style={[styles.border,styles.tableCell,{width: '20%'}]}>
                <Text style={styles.signatoryPosition}>Date</Text>
              </View>
              <View style={[styles.border,styles.tableCell,{width: '35%'}]}>
                <Text style={styles.signatoryPosition}>Signature over Printed Name</Text>
                <Text style={styles.signatoryPosition}>GSU</Text>
              </View>
              <View style={[styles.border,styles.tableCell,{width: '20%'}]}>
                <Text style={styles.signatoryPosition}>Date</Text>
              </View>
            </View>
            <View style={styles.flex}>
            <Text style={[styles.signatoryFor,styles.border,{width: '55%'}]}>Verified by:</Text>
            <Text style={[styles.signatoryFor,styles.border,{width: '55%'}]}>Approved by:</Text>
            </View>
            <View style={styles.flex}>
              <View style={[styles.border,styles.tableCell,{width: '35%'}]}>
                <Text style={styles.signatoryName}>GLADYS A. ELTANAL</Text>
              </View>
              <View style={[styles.border,styles.tableCell,{width: '20%'}]}>
                <Text></Text>
              </View>
              <View style={[styles.border,styles.tableCell,{width: '35%'}]}>
                <Text style={styles.signatoryName}>MAE R. DIZON</Text>
              </View>
              <View style={[styles.border,styles.tableCell,{width: '20%'}]}>
                <Text></Text>
              </View>
            </View>
            <View style={styles.flex}>
              <View style={[styles.border,styles.tableCell,{width: '35%'}]}>
                <Text style={styles.signatoryPosition}>Signature over Printed Name</Text>
                <Text style={styles.signatoryPosition}>Head, GSU</Text>
              </View>
              <View style={[styles.border,styles.tableCell,{width: '20%'}]}>
                <Text style={styles.signatoryPosition}>Date</Text>
              </View>
              <View style={[styles.border,styles.tableCell,{width: '35%'}]}>
                <Text style={styles.signatoryPosition}>Signature over Printed Name</Text>
                <Text style={styles.signatoryPosition}>Chief, MSD</Text>
              </View>
              <View style={[styles.border,styles.tableCell,{width: '20%'}]}>
                <Text style={styles.signatoryPosition}>Date</Text>
              </View>
            </View>
          </View>
        
        </Page>
    </Document>
    </PDFViewer>
  );
}

Font.register({
  family: "Georgia Bold",
  src: "/fonts/georgia/georgia_bold.ttf",
});
Font.register({
  family: "Georgia Regular",
  src: "/fonts/georgia/Georgia.ttf",
});


const styles = StyleSheet.create({
    boldFont: {
      fontFamily: 'Georgia Bold',
      fontSize: 12,
    },
    logo: {
      width: 35,
    },
    body: {
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 50,
      fontSize: 12,
      fontFamily: 'Georgia Regular',
    },
    flex:{
      flexDirection: "row",
    },
    border:{
      border: "1px solid black",
      marginLeft: -1,
      padding:2,
    },
    noTopBottomBorder: {
      borderTop: 0,
      borderBottom: 0,
      borderLeft: '1px solid black',
      borderRight: '1px solid black',
      padding:2,
      marginLeft: -1,
    },
    bottomBorder: {
      borderBottom: '1px solid black',
      borderLeft: '1px solid black',
      borderRight: '1px solid black',
      padding:2,
      marginLeft: -1,
      paddingTop:5,
    },
    header: {
      alignItems: "center",
      padding: "3px 3px 3px 10px",
      border: '1px solid black',
      marginBottom: 20
    },
    tableHeader: {
      display: 'flex',
      textAlign: 'center',
      justifyContent: 'center',
      backgroundColor: '#fbd4b4',
      textTransform: 'uppercase',
      fontFamily: 'Georgia Bold',
      fontSize: 8
    },
    tableCell: {
      marginTop: -1,
      display: 'flex',
      justifyContent: 'flex-start',
      borderTop: 0,
      fontSize: 10
    },
    date: {
      paddingBottom: 10,
    },
    title: {
      fontSize: 14,
      textTransform: 'uppercase',
      padding: '28 0 0 25'
    },
    formNo: {
      fontSize: 8,
      position: 'absolute',
      right:0,
      bottom: 0,
    },
    rsfno: {
      textAlign: 'right',
      marginBottom: 30
    },
    salutation: {
      paddingTop: 30,
    },
    letterBody: {
      paddingTop: 10,
      paddingLeft: 20,
    },
    row : {
      paddingTop: 35,
      flexDirection: "row",
      alignItems: "center",
    },
    column: {
      width: '50%'
    },
    signatoryFor: {
      backgroundColor: '#fbd4b4',
      fontFamily: 'Georgia Bold',
      fontSize: 10
    },
    signatoryName: {
      paddingTop: 20,
      textAlign: 'center',
      textTransform: 'uppercase',
      fontSize:10
    },
    signatoryPosition: {
      textAlign: 'center',
      fontSize: 10,
    },
    horizontalLine: {
      borderTop: '2px solid black',
      marginTop: 5
    }

  });

  // ReactPDF.render(<Pdf />,'');