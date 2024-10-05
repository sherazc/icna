import React from 'react';
import { render } from '@testing-library/react';
import {Authenticated} from "../../../components/auth/Authentecated";

describe("Authenticated", () => {

    test('Not authenticated', () => {
        const { getByText } = render(<Authenticated authenticated={false}>Hello, World!</Authenticated>)
        const messageElement = getByText(/Hello, World!/i);
        expect(messageElement).toBeInTheDocument();
    });
/*
    test('Authenticated', () => {
        jest.spyOn(React, 'useContext').mockImplementationOnce(() => {
            return {
                authUserToken: {token:"abc"}
            }
        })

        const { getByText } = render(<Authenticated>Hello, World!</Authenticated>)
        const messageElement = getByText(/Hello, World!/i);
        expect(messageElement).toBeInTheDocument();


    });
 */
})