import { resize } from "utils/resize";

function createStyles(theme: any) {
  return {
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: resize(200),
      backgroundColor: 'rgba(0, 0, 0, .2)',
      flex: 1
    },
    main: {
      display: 'flex',
      flexDirection: 'column',
      width: resize(338),
      minHeight: resize(225),
      backgroundColor: '#F4F5F7',
      borderRadius: resize(9),
      paddingHorizontal: resize(14),
      paddingBottom: resize(16),
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: resize(30),
      borderBottomColor: theme.borderColor,
      borderBottomWidth: theme.px,
    },
    title: {
      fontSize: resize(12),
      color: '#3B3E42',
    },
    content: {
      flex: 1,
    },
    contentText: {
      marginTop: resize(10),
      fontSize: resize(16),
      color: '#3B3E42',
      fontWeight: "400",
    },
    footer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    button: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: resize(76),
      height: resize(25),
      borderRadius: resize(13),
    },
    cancelButton: {
      borderWidth: theme.px,
      borderColor: '#806E47',
      backgroundColor: 'transparent',
      marginRight: resize(13),
    },
    okButton: {
      backgroundColor: '#3B3E42',
    },
    buttonText: {
      fontSize: resize(13)
    },
    cancelButtonText: {
      color: '#806E47',
    },
    okButtonText: {
      color: '#FFFFFF'
    },
  };
}
export default createStyles;