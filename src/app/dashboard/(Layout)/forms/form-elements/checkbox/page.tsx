import Breadcrumb from "@/app/dashboard/(Layout)/layout/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/components/container/PageContainer";
import ParentCard from "@/components/shared/ParentCard";
import ChildCard from "@/components/shared/ChildCard";

import { Grid } from "@mui/material";

// custom components
import PositionCheckbox from "@/components/forms/form-elements/checkbox/Position";
import SizesCheckbox from "@/components/forms/form-elements/checkbox/Sizes";
import DefaultcolorsCheckbox from "@/components/forms/form-elements/checkbox/DefaultColors";
import CustomEleCheckbox from "@/components/forms/form-elements/checkbox/Custom";
import DefaultCheckbox from "@/components/forms/form-elements/checkbox/Default";
import ColorsCheckbox from "@/components/forms/form-elements/checkbox/Colors";

// codeModel
import CustomEleCheckboxCode from "@/components/forms/form-elements/checkbox/code/CustomEleCheckboxCode";
import ColorsCheckboxCode from "@/components/forms/form-elements/checkbox/code/ColorsCheckboxCode";
import DefaultCheckboxCode from "@/components/forms/form-elements/checkbox/code/DefaultCheckboxCode";
import DefaultcolorsCheckboxCode from "@/components/forms/form-elements/checkbox/code/DefaultcolorsCheckboxCode";
import SizesCheckboxCode from "@/components/forms/form-elements/checkbox/code/SizesCheckboxCode";
import PositionCheckboxCode from "@/components/forms/form-elements/checkbox/code/PositionCheckboxCode";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Checkbox",
  },
];

const MuiCheckbox = () => {
  return (
    (<PageContainer title="Checkbox" description="this is Checkbox">
      {/* breadcrumb */}
      <Breadcrumb title="Checkbox" items={BCrumb} />
      {/* end breadcrumb */}
      <ParentCard title="Checkbox">
        <Grid container spacing={3}>
          {/* ------------------------------------------------------------------- */}
          {/* Custom  */}
          {/* ------------------------------------------------------------------- */}
          <Grid
            display="flex"
            alignItems="stretch"
            size={{
              xs: 12,
              lg: 6,
              sm: 6
            }}>
            <ChildCard title="Custom" codeModel={<CustomEleCheckboxCode />}>
              <CustomEleCheckbox />
            </ChildCard>
          </Grid>
          {/* ------------------------------------------------------------------- */}
          {/* Colors  */}
          {/* ------------------------------------------------------------------- */}
          <Grid
            display="flex"
            alignItems="stretch"
            size={{
              xs: 12,
              lg: 6,
              sm: 6
            }}>
            <ChildCard title="Colors" codeModel={<ColorsCheckboxCode />}>
              <ColorsCheckbox />
            </ChildCard>
          </Grid>
          {/* ------------------------------------------------------------------- */}
          {/* Default Checkbox */}
          {/* ------------------------------------------------------------------- */}
          <Grid
            display="flex"
            alignItems="stretch"
            size={{
              xs: 12,
              lg: 6,
              sm: 6
            }}>
            <ChildCard title="Default" codeModel={<DefaultCheckboxCode />}>
              <DefaultCheckbox />
            </ChildCard>
          </Grid>
          {/* ------------------------------------------------------------------- */}
          {/* Default with colors */}
          {/* ------------------------------------------------------------------- */}
          <Grid
            display="flex"
            alignItems="stretch"
            size={{
              xs: 12,
              lg: 6,
              sm: 6
            }}>
            <ChildCard
              title="Default with Colors"
              codeModel={<DefaultcolorsCheckboxCode />}
            >
              <DefaultcolorsCheckbox />
            </ChildCard>
          </Grid>
          {/* ------------------------------------------------------------------- */}
          {/* Sizes */}
          {/* ------------------------------------------------------------------- */}
          <Grid
            display="flex"
            alignItems="stretch"
            size={{
              xs: 12,
              lg: 6,
              sm: 6
            }}>
            <ChildCard
              title="Sizes & Custom Icon"
              codeModel={<SizesCheckboxCode />}
            >
              <SizesCheckbox />
            </ChildCard>
          </Grid>
          {/* ------------------------------------------------------------------- */}
          {/* Position */}
          {/* ------------------------------------------------------------------- */}
          <Grid
            display="flex"
            alignItems="stretch"
            size={{
              xs: 12,
              lg: 6,
              sm: 6
            }}>
            <ChildCard title="Position" codeModel={<PositionCheckboxCode />}>
              <PositionCheckbox />
            </ChildCard>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>)
  );
};

export default MuiCheckbox;
