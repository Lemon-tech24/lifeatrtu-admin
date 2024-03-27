import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { BarChart, XAxis, YAxis, CartesianGrid, Bar } from "recharts";
import ReactPDFChart from "react-pdf-charts";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  table: {
    display: "flex",
    flexDirection: "column",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    width: "100%",
  },
  textColumn: { fontSize: 20 },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
    fontSize: 20,
  },
  tableCell: {
    padding: 5,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    flexGrow: 1,
    width: `${100 / 5}%`,
    fontSize: 12,
  },
  tableText: {
    textAlign: "justify",
  },
});
const tableData = [
  {
    email: "user1@example.com",
    title: "Post 1",
    focus: "Focus 1",
    content:
      "asdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdsssssssssssssssssssssssssssssssssasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdaaaaassssssssssssssssssssssdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasdasdas dasdasd asdasdasda",
    riskCategory: "Low",
  },
  {
    email: "user2@example.com",
    title: "Post 2",
    focus: "Focus 2",
    content: "Content 2",
    riskCategory: "Medium",
  },
  {
    email: "user3@example.com",
    title: "Post 3",
    focus: "Focus 3",
    content: "Content 3",
    riskCategory: "High",
  },
];

const dataT = [
  { name: "A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "B", uv: 3000, pv: 1398, amt: 2210 },
  { name: "C", uv: 2000, pv: 9800, amt: 2290 },
  { name: "D", uv: 2780, pv: 3908, amt: 2000 },
  { name: "E", uv: 1890, pv: 4800, amt: 2181 },
  { name: "F", uv: 2390, pv: 3800, amt: 2500 },
  { name: "G", uv: 3490, pv: 4300, amt: 2100 },
];

const AuditReportPDF = ({ data }: any) => (
  <Document>
    <Page size="A4" style={styles.page} orientation="landscape">
      <View style={{ display: "flex", flexDirection: "row" }}>
        <Text>Reported Post</Text>
        <Text> DATE from March 3 to feb 2</Text>
      </View>
      <View style={styles.section}>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text style={styles.textColumn}>Email</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.textColumn}>Title</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.textColumn}>Focus</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.textColumn}>Content</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.textColumn}>Risk Category</Text>
            </View>
          </View>
          {/* Table Data */}
          {data.map((row: any, index: any) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text>{row.email}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{row.title}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{row.focus}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableText}>{row.content}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{row.riskCategory}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </Page>
    <Page size="A4" style={styles.page} orientation="landscape">
      <ReactPDFChart>
        <BarChart width={500} height={300} data={dataT}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
          <Bar dataKey="riskCategory" fill="#8884d8" />
        </BarChart>
      </ReactPDFChart>
    </Page>
  </Document>
);

export default AuditReportPDF;
