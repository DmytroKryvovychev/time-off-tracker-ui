import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { useTranslation } from 'react-i18next';

import { Approved, Rejected, NewRequests } from '../components/OtherRequests/index';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function OtherRequests() {
  const [value, setValue] = React.useState(0);
  const { t, i18n } = useTranslation(['reviews', 'notifications']);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <AppBar
        style={{ width: i18n.language === 'ru' ? '528px' : '480px' }}
        position="static"
        color="default">
        <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary">
          <Tab label={t('NewRequests')} />
          <Tab label={t('ApprovedByMe')} />
          <Tab label={t('RejectedByMe')} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <NewRequests />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Approved />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Rejected />
      </TabPanel>
    </div>
  );
}

export default OtherRequests;
