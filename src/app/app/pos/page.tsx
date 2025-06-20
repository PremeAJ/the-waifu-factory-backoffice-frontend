"use client";
import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Divider,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SearchIcon from "@mui/icons-material/Search";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close"; // เพิ่ม import
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Image from "next/image";

// Mock data
const categories = [
  {
    id: 0,
    name: "ทั้งหมด",
    children: [],
  },
  {
    id: 1,
    name: "เครื่องดื่ม",
    children: [
      { id: 11, name: "นม" },
      { id: 12, name: "โค้ก" },
      { id: 13, name: "เหล้า" },
    ],
  },
  {
    id: 2,
    name: "อาหารจานเดียว",
    children: [{ id: 21, name: "กระเพรา" }],
  },
  {
    id: 3,
    name: "ขนม",
    children: [],
  },
];

const products = [
  {
    id: 1,
    name: "ลาเต้",
    price: 60,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=256&q=80",
    categoryId: 1,
  },
  {
    id: 2,
    name: "อเมริกาโน่",
    price: 50,
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=facearea&w=256&q=80",
    categoryId: 1,
  },
  {
    id: 3,
    name: "ชาเขียว",
    price: 55,
    image: "https://yalamarketplace.com/upload/1658399714294.jpg",
    categoryId: 11,
  },
  {
    id: 4,
    name: "ขนมปังปิ้ง",
    price: 35,
    image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=facearea&w=256&q=80",
    categoryId: 3,
  },
  {
    id: 5,
    name: "โค้กกระป๋อง",
    price: 25,
    image: "https://assets.tops.co.th/COKE-Coke180ml-8851959108017-1?$JPEG$",
    categoryId: 12,
  },
  {
    id: 6,
    name: "เหล้าขาว",
    price: 120,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=256&q=80",
    categoryId: 13,
  },
  {
    id: 7,
    name: "ข้าวกระเพรา",
    price: 45,
    image:
      "https://www.maggi.co.th/sites/default/files/styles/home_stage_944_531/public/srh_recipes/c07747088f182ba6cfabe8be6724229e.jpg?h=74b9fe57&itok=Uz4HIxlX",
    categoryId: 21,
  },
];

export default function POSPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(null);
  const [openCategory, setOpenCategory] = useState<{ [key: number]: boolean }>({});
  const [order, setOrder] = useState<{ id: number; name: string; price: number; qty: number; image: string }[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Handle expand/collapse
  const handleToggleCategory = (catId: number) => {
    setOpenCategory((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 0) {
      return p.name.toLowerCase().includes(search.toLowerCase());
    }
    if (selectedSubCategory) {
      return p.categoryId === selectedSubCategory && p.name.toLowerCase().includes(search.toLowerCase());
    }
    // ถ้าเลือก category หลัก ให้แสดงสินค้าทั้งหมดใน category นั้นและ subcategory
    const cat = categories.find((c) => c.id === selectedCategory);
    const subIds = cat?.children?.map((c) => c.id) || [];
    return (p.categoryId === selectedCategory || subIds.includes(p.categoryId)) && p.name.toLowerCase().includes(search.toLowerCase());
  });

  const addToOrder = (product: (typeof products)[0]) => {
    setOrder((prev) => {
      const exist = prev.find((item) => item.id === product.id);
      if (exist) {
        return prev.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromOrder = (productId: number) => {
    setOrder((prev) => prev.map((item) => (item.id === productId ? { ...item, qty: item.qty - 1 } : item)).filter((item) => item.qty > 0));
  };

  const total = order.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <Grid container spacing={2} sx={{ height: isMobile ? "auto" : "100vh" }}>
      {/* Sidebar: Category */}
      <Grid
        size={{ xs: 12, sm: 3, md: 2 }}
        sx={{
          height: isMobile ? "auto" : "100%",
          order: isMobile ? 1 : 0,
          mb: isMobile ? 2 : 0,
        }}
      >
        <Paper sx={{ height: "100%", p: 2, bgcolor: "grey.50" }}>
          <Typography variant="h6" gutterBottom>
            หมวดหมู่
          </Typography>
          <List sx={{ display: "flex", flexDirection: isMobile ? "row" : "column", overflowX: isMobile ? "auto" : "visible" }}>
            {categories.map((cat) => (
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
                    minWidth: isMobile ? "auto" : undefined, // เปลี่ยนตรงนี้
                    maxWidth: isMobile ? 160 : undefined,    // จำกัดความกว้างสูงสุด
                    bgcolor: selectedCategory === cat.id && !selectedSubCategory ? "primary.lighter" : undefined,
                    whiteSpace: "nowrap",
                  }}
                >
                  <ListItemText
                    primary={cat.name}
                    sx={{
                      flexShrink: 1,
                      minWidth: 0,
                      maxWidth: isMobile ? 120 : undefined, // จำกัด text ไม่ให้ดัน icon
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
                      {cat.children.map((sub) => (
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
        </Paper>
      </Grid>

      {/* Left: Product Card List */}
      <Grid
        size={{ xs: 12, sm: 9, md: 7 }}
        sx={{
          order: isMobile ? 2 : 0,
        }}
      >
        <Card sx={{ display: "flex", flexDirection: "column", height: isMobile ? "auto" : "100%" }}>
          <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Typography variant="h5" gutterBottom>
              สินค้าทั้งหมด
            </Typography>
            <TextField
              placeholder="ค้นหาสินค้า"
              size="small"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <Grid
              container
              spacing={isMobile ? 1 : 2}
              sx={{
                alignItems: "flex-start",
                maxHeight: isMobile ? "none" : "calc(100vh - 180px)",
                overflow: isMobile ? "visible" : "auto",
              }}
            >
              {filteredProducts.map((product) => (
                <Grid size={{ xs: 4, sm: 4, md: 3, lg: 3, xl: 2 }} key={product.id}>
                  <Card
                    variant="outlined"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      p: 0,
                      height: isMobile ? 140 : 220, // ลดความสูงลง
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        height: isMobile ? 60 : 120, // ลดความสูงรูป
                        overflow: "hidden",
                        bgcolor: "#f5f5f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 600px) 100vw, 33vw"
                      />
                    </Box>
                    <Box
                      sx={{
                        flex: 1,
                        width: "100%",
                        p: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        gutterBottom
                        align="center"
                        sx={{ fontSize: isMobile ? 12 : 14 }}
                      >
                        {product.name}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        gutterBottom
                        align="center"
                        sx={{ fontSize: isMobile ? 11 : 13 }}
                      >
                        ฿{product.price}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        fullWidth
                        onClick={() => addToOrder(product)}
                        sx={{ fontSize: isMobile ? 12 : 14, py: isMobile ? 0.3 : 0.7 }}
                      >
                        เพิ่ม
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
              {filteredProducts.length === 0 && (
                <Grid size={{ xs: 12 }}>
                  <Typography color="text.secondary" align="center" sx={{ mt: 2 }}>
                    ไม่พบสินค้า
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Right: Order Summary */}
      <Grid
        size={{ xs: 12, md: 3 }}
        sx={{
          height: isMobile ? "auto" : "100%",
          order: isMobile ? 3 : 0,
          mt: isMobile ? 2 : 0,
        }}
      >
        <Card sx={{ height: isMobile ? "auto" : "100%", display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", p: isMobile ? 1 : 2 }}>
            <Typography variant="h6" gutterBottom>
              ออเดอร์ของคุณ
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ flex: 1, maxHeight: isMobile ? "none" : "50vh", overflow: isMobile ? "visible" : "auto" }}>
              {order.map((item: any) => (
                <Box key={item.id} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        overflow: "hidden",
                        bgcolor: "#f5f5f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} sizes="40px" />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: isMobile ? 13 : 15 }}>{item.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        ฿{item.price * item.qty}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <IconButton size="small" onClick={() => removeFromOrder(item.id)} disabled={item.qty <= 1}>
                      <RemoveIcon />
                    </IconButton>
                    <Typography component="span" sx={{ mx: 1 }}>
                      {item.qty}
                    </Typography>
                    <IconButton size="small" onClick={() => addToOrder(item)}>
                      <AddIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => setOrder((prev) => prev.filter((o) => o.id !== item.id))} sx={{ ml: 1 }}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
              {order.length === 0 && (
                <Typography color="text.secondary" align="center" sx={{ mt: 2 }}>
                  ยังไม่มีสินค้าในออเดอร์
                </Typography>
              )}
            </Box>
            <Box sx={{ mt: "auto" }}>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">รวม</Typography>
                <Typography variant="h5" color="primary">
                  ฿{total}
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="success"
                fullWidth
                sx={{ mt: 2, fontSize: isMobile ? 14 : 16, py: isMobile ? 1 : 2 }}
                disabled={order.length === 0}
                onClick={() => alert("ยืนยันออเดอร์!")}
              >
                ยืนยันออเดอร์
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
