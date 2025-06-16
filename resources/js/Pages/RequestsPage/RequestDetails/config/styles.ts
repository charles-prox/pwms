import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 45,
        paddingHorizontal: 45,
    },
    row: {
        display: "flex",
        flexDirection: "row",
        borderBottom: "1px solid black",
        padding: 4,
    },
    rowNoBorder: {
        display: "flex",
        flexDirection: "row",
        padding: 4,
    },
    rowLabel: {
        width: 400,
        textAlign: "left",
        padding: 5,
    },
    rowValue: {
        width: "100%",
        fontWeight: "bold",
        textAlign: "left",
        textTransform: "uppercase",
        padding: 5,
    },
    perRecordRow: {
        display: "flex",
        fontWeight: "semibold",
        flexDirection: "row",
        paddingLeft: 15,
        paddingRight: 4,
        paddingVertical: 2,
    },
    priorityRow: {
        display: "flex",
        flexDirection: "row",
        marginBottom: 3,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    priorityCode: {
        flexGrow: 1,
        border: "1px solid black",
        alignItems: "center",
        textTransform: "uppercase",
        fontWeight: "bold",
        fontSize: 20,
        padding: 8,
    },
    title: {
        width: "100%",
        paddingRight: 10,
    },
});
