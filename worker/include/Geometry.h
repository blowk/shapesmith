#ifndef SS_GEOMETRY
#define SS_GEOMETRY

#include <json_spirit.h>
#include "OCC.h"

using namespace std;
using namespace json_spirit;

class Builder {
protected:
    TopoDS_Shape shape_;
    
    void ApplyOrigin(map< string, mValue > json);
    void ApplyTransform(map< string, mValue > json);
    void ApplyTransforms(map< string, mValue > json);
    virtual void PostProcess(map< string, mValue > json) = 0;
    
public:
    TopoDS_Shape shape();
    
};

#pragma mark 3D primitives

class Builder3D : public Builder {
private:
    void Mesh();
protected:
    virtual void PostProcess(map< string, mValue > json);
public:
    Builder3D() {};
    
};

class CuboidBuilder : public Builder3D {

public:
    CuboidBuilder(map< string, mValue > json);
    ~CuboidBuilder();
};

class SphereBuilder : public Builder3D {
public:
    SphereBuilder(map< string, mValue > json);
    ~SphereBuilder();
};

class CylinderBuilder : public Builder3D {
public:
    CylinderBuilder(map< string, mValue > json);
    ~CylinderBuilder();
};

class ConeBuilder : public Builder3D {
public:
    ConeBuilder(map< string, mValue > json);
    ~ConeBuilder();
};

class WedgeBuilder : public Builder3D {
public:
    WedgeBuilder(map< string, mValue > json);
    ~WedgeBuilder();
};

class TorusBuilder : public Builder3D {
public:
    TorusBuilder(map< string, mValue > json);
    ~TorusBuilder();
};

#pragma mark 1D Primitives

class Builder1D : public Builder {
protected:
    virtual void PostProcess(map< string, mValue > json);
};

class Ellipse1DBuilder : public Builder1D {
public:
    Ellipse1DBuilder(map< string, mValue > json);
    ~Ellipse1DBuilder();
};

#pragma mark Booleans

typedef TopoDS_Shape (*boolean_op)(const TopoDS_Shape&, const TopoDS_Shape&);

class BooleanBuilder : public Builder3D {
public:
    BooleanBuilder(map< string, mValue > json, vector<TopoDS_Shape>& shapes, boolean_op fn);
};

class UnionBuilder : public BooleanBuilder {
public:
    UnionBuilder(map< string, mValue > json, vector<TopoDS_Shape>& shapes);
    ~UnionBuilder();
};

class SubtractBuilder : public BooleanBuilder {
public:
    SubtractBuilder(map< string, mValue > json, vector<TopoDS_Shape>& shapes);
    ~SubtractBuilder();
};

class IntersectBuilder : public BooleanBuilder {
public:
    IntersectBuilder(map< string, mValue > json, vector<TopoDS_Shape>& shapes);
    ~IntersectBuilder();
};

#endif