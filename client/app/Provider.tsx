import React from "react";
import {persistor, store} from "@/redux/store";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";

interface ProvidersProps {
    children: any;
}

export function Providers({children}: ProvidersProps) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
}
