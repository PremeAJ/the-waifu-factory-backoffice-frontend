import React from "react";
import { List, ListItemButton, ListItemText, Collapse, Typography } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function SidebarCategory({
  categories,
  handleToggleCategory,
  isMobile,
  openCategory,
  selectedCategory,
  selectedSubCategory,
  setSelectedCategory,
  setSelectedSubCategory,
}: any) {
  return (
    <List sx={{ display: "flex", flexDirection: isMobile ? "row" : "column", overflowX: isMobile ? "auto" : "visible" }}>
      {categories.map((cat: any) => (
        <React.Fragment key={cat.id}>
          <ListItemButton
            selected={selectedCategory === cat.id && !selectedSubCategory}
            onClick={() => {
              setSelectedCategory(cat.id);
              setSelectedSubCategory(null);
            }}
            sx={{
              borderRadius: 1,
              mb: isMobile ? 0 : 0.5,
              mr: isMobile ? 1 : 0,
              minWidth: isMobile ? "auto" : undefined,
              maxWidth: isMobile ? 160 : undefined,
              bgcolor: selectedCategory === cat.id && !selectedSubCategory ? "primary.lighter" : undefined,
              whiteSpace: "nowrap",
            }}
          >
            <ListItemText
              primary={cat.name}
              sx={{
                flexShrink: 1,
                minWidth: 0,
                maxWidth: isMobile ? 120 : undefined,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            />
            {cat.children && cat.children.length > 0 ? (
              isMobile ? (
                openCategory[cat.id] ? (
                  <ChevronLeftIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleCategory(cat.id);
                    }}
                  />
                ) : (
                  <ChevronRightIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleCategory(cat.id);
                    }}
                  />
                )
              ) : openCategory[cat.id] ? (
                <ExpandLess
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleCategory(cat.id);
                  }}
                />
              ) : (
                <ExpandMore
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleCategory(cat.id);
                  }}
                />
              )
            ) : null}
          </ListItemButton>
          {cat.children && cat.children.length > 0 && (
            <Collapse in={openCategory[cat.id]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ flexDirection: isMobile ? "row" : "column", display: isMobile ? "flex" : "block" }}>
                {cat.children.map((sub: any) => (
                  <ListItemButton
                    key={sub.id}
                    selected={selectedSubCategory === sub.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSelectedSubCategory(sub.id);
                    }}
                    sx={{
                      pl: isMobile ? 2 : 4,
                      borderRadius: 1,
                      mb: 0.5,
                      mr: isMobile ? 1 : 0,
                      bgcolor: selectedSubCategory === sub.id ? "primary.lighter" : undefined,
                      minWidth: isMobile ? 100 : undefined,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <ListItemText primary={sub.name} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      ))}
    </List>
  );
}
