import * as React from 'react';

import PageContainer from '@/components/container/PageContainer';
import TableColumnVisibility from '@/components/react-table/TableColumnVisibility';
import Breadcrumb from '@/components/shared/breadcrumb/Breadcrumb';

const BCrumb = [
    {
        to: '/',
        title: 'Home',
    },
    {
        title: 'Column Visibility React Table',
    },
];


const ReactColumnVisibilityTable = () => {

    return (
        <PageContainer title="Column Visibility Table" description="this is Column Visibility Table">
            {/* breadcrumb */}
            <Breadcrumb title="Column Visibility Table" items={BCrumb} />
            {/* end breadcrumb */}
            <TableColumnVisibility />
        </PageContainer>
    );
};

export default ReactColumnVisibilityTable;
