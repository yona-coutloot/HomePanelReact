import { useEffect } from "react";
import { Layout, Result, Button } from "antd";
import { Switch, Route, useHistory } from "react-router-dom";
import EditTemplate from "./pages/editTemplate/EditTemplate";
import AllTemplate from "./pages/allTemplates/AllTemplate";
import "./app.css";
import Login from "./components/login/Login";
import Deals from "./pages/deals/Deals";
import AddDeals from "./pages/deals/AddDeals";
import AllCollection from "./pages/allCollections/AllCollection";
import CollectionFilter from "./pages/collectionFilter/CollectionFilter";
import CreateCollection from "./pages/createCollection/CreateCollection";
import ViewEditCollection from "./pages/viewEditCollection/ViewEditCollection";

const App = () => {
  //? AUTH GUARD ADDED FOR PROTECTED ROUTE
  const history = useHistory();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      history.push("/");
    }
  }, [history]);

  const NotFound = () => {
    return (
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={() => history.push("/allTemplates")}>
            Back Home
          </Button>
        }
      />
    );
  };

  return (
    <Layout className="app_layout" style={{ minHeight: "100vh" }}>
      <Switch>
        <Route path="/login" exact component={() => <Login />} />
        {/* <Route
          path="/allTemplates"
          render={({ match: { url } }) => (
            <>
              <Route path={`${url}/`} component={() => <AllTemplate />} exact />
              <Route
                path={`${url}/editTemplate/:templateId`}
                component={() => <EditTemplate />}
              />
            </>
          )}
        /> */}
        <Route
          path="/deals"
          render={({ match: { url } }) => (
            <>
              <Route path={`${url}/`} component={() => <Deals />} exact />
              <Route path={`${url}/addDeals`} component={() => <AddDeals />} />
              <Route path={`${url}/editDeal/:couponId`} component={() => <AddDeals />} />
            </>
          )}
        />
        <Route
          path="/collections"
          render={({ match: { url } }) => (
            <>
              <Route path={`${url}/`} component={() => <AllCollection />} exact />
              <Route path={`${url}/filters`} component={() => <CollectionFilter />} exact />
              <Route
                path={`${url}/filters/createCollection`}
                component={() => <CreateCollection />}
                exact
              />
              <Route
                path={`${url}/viewEditCollection/:collectionId`}
                component={() => <ViewEditCollection />}
                exact
              />
            </>
          )}
        />

        
        <Route path="/" exact component={() => <Login />} />
        <Route path="*" exact={true} component={() => <NotFound />} />
      </Switch>
    </Layout>
  );
};

export default App;
